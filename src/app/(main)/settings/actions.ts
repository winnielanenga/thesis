
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { CareerPath } from "@/types/database"
import { MILESTONES } from "@/data/milestones"

export async function updateProfile(data: { careerPath?: CareerPath; dreamColleges?: string[]; targetGpa?: number | null }) {
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

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

    if (error) throw new Error(error.message)

    // If career path changed, delete old milestones and re-seed
    if (data.careerPath) {
        await reseedMilestones(userId, data.careerPath)
    }

    revalidatePath('/settings')
    revalidatePath('/college-prep')
    revalidatePath('/planner')
    revalidatePath('/dashboard')
    revalidatePath('/academics')
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

    // 2. Get graduation year to determine current grade
    const { data: profile } = await supabase
        .from('profiles')
        .select('graduation_year')
        .eq('id', userId)
        .single()

    if (!profile?.graduation_year) return

    const now = new Date()
    const academicYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
    const currentGrade = Math.max(9, Math.min(12, 12 - (profile.graduation_year - academicYear - 1)))

    // 3. Filter milestones for the new career path
    const relevant = MILESTONES.filter(m => {
        if (!m.grade_level || m.grade_level < currentGrade) return false
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

export async function resetAccount() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const userId = session.user.id

    await supabase.from('user_milestones').delete().eq('user_id', userId)
    await supabase.from('tasks').delete().eq('user_id', userId)
    await supabase.from('profiles').delete().eq('id', userId)

    return { success: true }
}
