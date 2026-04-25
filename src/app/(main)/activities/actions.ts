
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { ActivityCategory } from "@/types/database"

const VALID_CATEGORIES: ActivityCategory[] = [
    'Academic', 'Athletics', 'Arts', 'Community Service',
    'Leadership / Government', 'Work / Internship',
    'Religious / Cultural', 'Research / Science', 'Other',
]

const VALID_GRADES = [9, 10, 11, 12] as const

async function requireUserId(): Promise<string> {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    return session.user.id
}

export interface ActivityInput {
    name: string
    organization?: string | null
    role?: string | null
    category: ActivityCategory
    description?: string | null
    hours_per_week?: number | null
    weeks_per_year?: number | null
    grade_levels?: number[]
    continue_in_college?: boolean
}

function validate(input: Partial<ActivityInput>) {
    if (input.category !== undefined && !VALID_CATEGORIES.includes(input.category)) {
        throw new Error("Invalid activity category")
    }
    if (input.hours_per_week !== undefined && input.hours_per_week !== null) {
        if (input.hours_per_week < 0 || input.hours_per_week > 168) {
            throw new Error("Hours per week must be between 0 and 168")
        }
    }
    if (input.weeks_per_year !== undefined && input.weeks_per_year !== null) {
        if (input.weeks_per_year < 0 || input.weeks_per_year > 52) {
            throw new Error("Weeks per year must be between 0 and 52")
        }
    }
    if (input.grade_levels !== undefined) {
        const invalid = input.grade_levels.filter(g => !VALID_GRADES.includes(g as 9 | 10 | 11 | 12))
        if (invalid.length > 0) throw new Error("Grade levels must be 9-12")
    }
}

export async function addActivity(input: ActivityInput) {
    const userId = await requireUserId()
    validate(input)

    if (!input.name?.trim()) throw new Error("Name is required")

    const { data, error } = await supabase
        .from('activities')
        .insert({
            user_id: userId,
            name: input.name.trim(),
            organization: input.organization?.trim() || null,
            role: input.role?.trim() || null,
            category: input.category,
            description: input.description?.trim() || null,
            hours_per_week: input.hours_per_week ?? null,
            weeks_per_year: input.weeks_per_year ?? null,
            grade_levels: input.grade_levels ?? [],
            continue_in_college: input.continue_in_college ?? false,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/activities')
    return data
}

export async function updateActivity(activityId: string, patch: Partial<ActivityInput>) {
    const userId = await requireUserId()
    validate(patch)

    const updateData: Record<string, unknown> = {}
    if (patch.name !== undefined) {
        if (!patch.name.trim()) throw new Error("Name cannot be empty")
        updateData.name = patch.name.trim()
    }
    if (patch.organization !== undefined) updateData.organization = patch.organization?.trim() || null
    if (patch.role !== undefined) updateData.role = patch.role?.trim() || null
    if (patch.category !== undefined) updateData.category = patch.category
    if (patch.description !== undefined) updateData.description = patch.description?.trim() || null
    if (patch.hours_per_week !== undefined) updateData.hours_per_week = patch.hours_per_week
    if (patch.weeks_per_year !== undefined) updateData.weeks_per_year = patch.weeks_per_year
    if (patch.grade_levels !== undefined) updateData.grade_levels = patch.grade_levels
    if (patch.continue_in_college !== undefined) updateData.continue_in_college = patch.continue_in_college

    const { error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', activityId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/activities')
}

export async function deleteActivity(activityId: string) {
    const userId = await requireUserId()

    const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/activities')
}
