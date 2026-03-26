
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { CareerPath } from "@/types/database"
import { MILESTONES } from "@/data/milestones"

export async function completeOnboarding(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) redirect("/")

    const graduationYear = parseInt(formData.get("graduationYear") as string)
    const careerPath = formData.get("careerPath") as CareerPath
    const dreamCollegesRaw = formData.get("dreamColleges") as string | null

    if (!graduationYear || !careerPath) {
        throw new Error("Missing fields")
    }

    // Parse dream colleges: split by comma, trim, filter empty
    const dreamColleges = dreamCollegesRaw
        ? dreamCollegesRaw.split(",").map(s => s.trim()).filter(Boolean)
        : []

    const userId = session.user.id

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            full_name: session.user.name,
            graduation_year: graduationYear,
            career_path: careerPath,
            target_gpa: 4.0,
            dream_colleges: dreamColleges.length > 0 ? dreamColleges : null,
        })

    if (error) {
        console.error("Profile Error:", JSON.stringify(error, null, 2))
        throw new Error(`Failed to save profile: ${error.message} (code: ${error.code}, details: ${error.details})`)
    }

    // Seed milestones (non-fatal)
    try {
        // Determine current academic year: if month >= August, academic year = calendar year, else calendar year - 1
        const now = new Date()
        const academicYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1

        // Derive grade level: 12 - (graduationYear - academicYear - 1)
        // e.g. grad 2028, academic year 2025 => 12 - (2028 - 2025 - 1) = 12 - 2 = 10
        const currentGrade = Math.max(9, Math.min(12, 12 - (graduationYear - academicYear - 1)))

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
