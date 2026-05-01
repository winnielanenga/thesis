
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { CareerPath } from "@/types/database"
import { MILESTONES } from "@/data/milestones"
import { getCurrentGrade } from "@/lib/utils"

export async function updateProfile(data: {
    careerPath?: CareerPath;
    dreamColleges?: string[];
    targetGpa?: number | null;
    schoolYear?: { startMonth: number; startDay: number; endMonth: number; endDay: number };
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const userId = session.user.id
    const updateData: any = {}
    if (data.careerPath) updateData.career_path = data.careerPath
    if (data.dreamColleges) updateData.dream_colleges = data.dreamColleges
    if (data.targetGpa !== undefined) {
        if (data.targetGpa !== null && (data.targetGpa < 0 || data.targetGpa > 5)) {
            throw new Error("Target GPA must be between 0 and 5")
        }
        updateData.target_gpa = data.targetGpa
    }
    // School year fields are written separately from the main update so a
    // missing migration 010 (columns don't exist yet) doesn't break the
    // whole settings save.
    let schoolYearUpdate: Record<string, number> | null = null
    if (data.schoolYear) {
        const { startMonth, startDay, endMonth, endDay } = data.schoolYear
        if (startMonth < 0 || startMonth > 11 || endMonth < 0 || endMonth > 11) {
            throw new Error("School year months must be 0-11")
        }
        if (startDay < 1 || startDay > 31 || endDay < 1 || endDay > 31) {
            throw new Error("School year days must be 1-31")
        }
        schoolYearUpdate = {
            school_year_start_month: startMonth,
            school_year_start_day: startDay,
            school_year_end_month: endMonth,
            school_year_end_day: endDay,
        }
    }

    if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
        if (error) throw new Error(error.message)
    }

    if (schoolYearUpdate) {
        const { error: schoolYearError } = await supabase
            .from('profiles')
            .update(schoolYearUpdate)
            .eq('id', userId)
        if (schoolYearError) {
            console.warn("School year fields not saved (run migration 010):", schoolYearError.message)
            throw new Error("Couldn't save school year dates. Run migration 010 in Supabase, then try again.")
        }
    }

    // If career path changed, delete old milestones and re-seed
    if (data.careerPath) {
        await reseedMilestones(userId, data.careerPath)
    }

    revalidatePath('/settings')
    revalidatePath('/college-prep')
    revalidatePath('/planner')
    revalidatePath('/dashboard')
    revalidatePath('/academics')
    revalidatePath('/onboarding')
}

export async function reseedMilestones(userId: string, careerPath: CareerPath) {
    // 1. Delete all existing user_milestones for this user
    const { error: deleteError } = await supabase
        .from('user_milestones')
        .delete()
        .eq('user_id', userId)

    if (deleteError) {
        console.error("Failed to delete old milestones:", deleteError)
        return
    }

    // 2. Get graduation year + school year start to determine current grade
    const { data: profile } = await supabase
        .from('profiles')
        .select('graduation_year')
        .eq('id', userId)
        .single()

    if (!profile?.graduation_year) return

    const { data: sy } = await supabase
        .from('profiles')
        .select('school_year_start_month, school_year_start_day')
        .eq('id', userId)
        .single()

    const currentGrade = getCurrentGrade(
        profile.graduation_year,
        sy?.school_year_start_month ?? 7,
        sy?.school_year_start_day ?? 1,
    )
    const minGrade = currentGrade ?? 9

    // 3. Filter milestones for the new career path
    const relevant = MILESTONES.filter(m => {
        if (!m.grade_level || m.grade_level < minGrade) return false
        const tags = m.path_tags ?? []
        return tags.length === 0 || tags.includes(careerPath)
    })

    if (relevant.length === 0) return

    // 4. Upsert milestone templates
    const templates = relevant.map(m => ({
        id: m.id,
        title: m.title!,
        description: m.description ?? null,
        grade_level: m.grade_level!,
        season: m.season ?? null,
        urgency_score: m.urgency_score!,
        path_tags: m.path_tags ?? [],
    }))

    const { error: templateError } = await supabase
        .from('milestone_templates')
        .upsert(templates, { onConflict: 'id' })

    if (templateError) {
        console.error("Template seed error:", templateError)
        return
    }

    // 5. Insert user_milestones
    const userMilestones = relevant.map(m => ({
        user_id: userId,
        template_id: m.id,
        status: 'pending' as const,
    }))

    const { error: milestoneError } = await supabase
        .from('user_milestones')
        .insert(userMilestones)

    if (milestoneError) {
        console.error("Milestone seed error:", milestoneError)
    }
}

export async function deleteAccount() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const userId = session.user.id

    // Delete from child tables first (FK order matters for exams -> courses)
    await Promise.all([
        supabase.from('user_milestones').delete().eq('user_id', userId),
        supabase.from('tasks').delete().eq('user_id', userId),
        supabase.from('exams').delete().eq('user_id', userId),
        supabase.from('essays').delete().eq('user_id', userId),
        supabase.from('activities').delete().eq('user_id', userId),
        supabase.from('recommendations').delete().eq('user_id', userId),
        supabase.from('test_attempts').delete().eq('user_id', userId),
    ])
    await supabase.from('courses').delete().eq('user_id', userId)
    await supabase.from('profiles').delete().eq('id', userId)

    return { success: true }
}
