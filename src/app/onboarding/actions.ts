
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { CareerPath } from "@/types/database"
import { MILESTONES } from "@/data/milestones"
import { getAcademicYearStart, getCurrentGrade } from "@/lib/utils"

export async function completeOnboarding(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) redirect("/")

    const graduationYear = parseInt(formData.get("graduationYear") as string)
    const careerPath = formData.get("careerPath") as CareerPath
    const dreamCollegesRaw = formData.get("dreamColleges") as string | null
    const targetGpaRaw = formData.get("targetGpa") as string | null
    const schoolYearStartRaw = formData.get("schoolYearStart") as string | null
    const schoolYearEndRaw = formData.get("schoolYearEnd") as string | null

    if (!graduationYear || !careerPath) {
        throw new Error("Missing fields")
    }

    // Parse dream colleges: split by comma, trim, filter empty
    const dreamColleges = dreamCollegesRaw
        ? dreamCollegesRaw.split(",").map(s => s.trim()).filter(Boolean)
        : []

    // Parse target GPA: optional, 0-5, default 4.0 if blank
    let targetGpa: number = 4.0
    if (targetGpaRaw && targetGpaRaw.trim()) {
        const parsed = parseFloat(targetGpaRaw)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
            targetGpa = parsed
        }
    }

    // Parse school year start/end. Year part is irrelevant — we only persist
    // month and day. Defaults: Sept 1 -> June 15 (typical US school year).
    const parseMonthDay = (raw: string | null, fallbackMonth: number, fallbackDay: number) => {
        if (!raw) return { month: fallbackMonth, day: fallbackDay }
        // Form date format is YYYY-MM-DD; parse without timezone games
        const [, m, d] = raw.split("-").map(Number)
        if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
            return { month: fallbackMonth, day: fallbackDay }
        }
        return { month: m - 1, day: d } // store month 0-11
    }
    const start = parseMonthDay(schoolYearStartRaw, 8, 1)
    const end = parseMonthDay(schoolYearEndRaw, 5, 15)

    const userId = session.user.id

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            full_name: session.user.name,
            graduation_year: graduationYear,
            career_path: careerPath,
            target_gpa: targetGpa,
            dream_colleges: dreamColleges.length > 0 ? dreamColleges : null,
            school_year_start_month: start.month,
            school_year_start_day: start.day,
            school_year_end_month: end.month,
            school_year_end_day: end.day,
        })

    if (error) {
        console.error("Profile Error:", JSON.stringify(error, null, 2))
        throw new Error(`Failed to save profile: ${error.message} (code: ${error.code}, details: ${error.details})`)
    }

    // Seed milestones (non-fatal)
    try {
        const currentGrade = getCurrentGrade(graduationYear)

        // Filter milestones: grade >= current grade AND (path_tags empty OR includes careerPath)
        const relevant = MILESTONES.filter(m => {
            if (!m.grade_level || m.grade_level < currentGrade) return false
            const tags = m.path_tags ?? []
            return tags.length === 0 || tags.includes(careerPath)
        })

        // First, upsert milestone templates into the milestone_templates table
        if (relevant.length > 0) {
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
            } else {
                // Insert user_milestones referencing template IDs
                const userMilestones = relevant.map(m => ({
                    user_id: userId,
                    template_id: m.id,
                    status: 'pending' as const,
                }))

                const { error: milestoneError } = await supabase
                    .from('user_milestones')
                    .upsert(userMilestones, { onConflict: 'user_id,template_id', ignoreDuplicates: true })

                if (milestoneError) {
                    console.error("Milestone seed error:", milestoneError)
                }
            }
        }
    } catch (e) {
        console.error("Milestone seeding failed (non-fatal):", e)
    }

    redirect("/dashboard")
}
