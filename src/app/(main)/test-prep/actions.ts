
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { TestType } from "@/types/database"

const VALID_TYPES: TestType[] = ['SAT', 'ACT', 'PSAT', 'AP', 'Subject Test', 'Other']

async function requireUserId(): Promise<string> {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    return session.user.id
}

export interface TestAttemptInput {
    test_type: TestType
    test_name?: string | null
    test_date: string
    registered?: boolean
    total_score?: number | null
    breakdown?: string | null
    goal_score?: number | null
    notes?: string | null
}

function validate(input: Partial<TestAttemptInput>) {
    if (input.test_type !== undefined && !VALID_TYPES.includes(input.test_type)) {
        throw new Error("Invalid test type")
    }
    if (input.total_score !== undefined && input.total_score !== null) {
        if (input.total_score < 0 || input.total_score > 2400) {
            throw new Error("Total score out of range")
        }
    }
    if (input.goal_score !== undefined && input.goal_score !== null) {
        if (input.goal_score < 0 || input.goal_score > 2400) {
            throw new Error("Goal score out of range")
        }
    }
}

export async function addTestAttempt(input: TestAttemptInput) {
    const userId = await requireUserId()
    validate(input)

    if (!input.test_date) throw new Error("Test date is required")

    const { data, error } = await supabase
        .from('test_attempts')
        .insert({
            user_id: userId,
            test_type: input.test_type,
            test_name: input.test_name?.trim() || null,
            test_date: input.test_date,
            registered: input.registered ?? false,
            total_score: input.total_score ?? null,
            breakdown: input.breakdown?.trim() || null,
            goal_score: input.goal_score ?? null,
            notes: input.notes?.trim() || null,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/test-prep')
    return data
}

export async function updateTestAttempt(id: string, patch: Partial<TestAttemptInput>) {
    const userId = await requireUserId()
    validate(patch)

    const updateData: Record<string, unknown> = {}
    if (patch.test_type !== undefined) updateData.test_type = patch.test_type
    if (patch.test_name !== undefined) updateData.test_name = patch.test_name?.trim() || null
    if (patch.test_date !== undefined) {
        if (!patch.test_date) throw new Error("Test date cannot be empty")
        updateData.test_date = patch.test_date
    }
    if (patch.registered !== undefined) updateData.registered = patch.registered
    if (patch.total_score !== undefined) updateData.total_score = patch.total_score
    if (patch.breakdown !== undefined) updateData.breakdown = patch.breakdown?.trim() || null
    if (patch.goal_score !== undefined) updateData.goal_score = patch.goal_score
    if (patch.notes !== undefined) updateData.notes = patch.notes?.trim() || null

    const { error } = await supabase
        .from('test_attempts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/test-prep')
}

export async function deleteTestAttempt(id: string) {
    const userId = await requireUserId()

    const { error } = await supabase
        .from('test_attempts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/test-prep')
}
