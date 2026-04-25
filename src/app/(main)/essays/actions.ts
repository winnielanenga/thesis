
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { EssayStatus, EssayType } from "@/types/database"

const VALID_TYPES: EssayType[] = ['Common App', 'Supplemental', 'Scholarship', 'Other']
const VALID_STATUSES: EssayStatus[] = ['Not Started', 'Drafting', 'Reviewing', 'Submitted']

async function requireUserId(): Promise<string> {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    return session.user.id
}

export interface EssayInput {
    title: string
    school?: string | null
    type: EssayType
    prompt?: string | null
    word_limit?: number | null
    status?: EssayStatus
    deadline?: string | null
    notes?: string | null
}

function validate(input: Partial<EssayInput>) {
    if (input.type !== undefined && !VALID_TYPES.includes(input.type)) {
        throw new Error("Invalid essay type")
    }
    if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
        throw new Error("Invalid essay status")
    }
    if (input.word_limit !== undefined && input.word_limit !== null) {
        if (input.word_limit <= 0 || input.word_limit > 100000) {
            throw new Error("Word limit must be between 1 and 100000")
        }
    }
}

export async function addEssay(input: EssayInput) {
    const userId = await requireUserId()
    validate(input)

    if (!input.title?.trim()) throw new Error("Title is required")

    const { data, error } = await supabase
        .from('essays')
        .insert({
            user_id: userId,
            title: input.title.trim(),
            school: input.school?.trim() || null,
            type: input.type,
            prompt: input.prompt?.trim() || null,
            word_limit: input.word_limit ?? null,
            status: input.status ?? 'Not Started',
            deadline: input.deadline || null,
            notes: input.notes?.trim() || null,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/essays')
    return data
}

export async function updateEssay(essayId: string, patch: Partial<EssayInput>) {
    const userId = await requireUserId()
    validate(patch)

    const updateData: Record<string, unknown> = {}
    if (patch.title !== undefined) {
        if (!patch.title.trim()) throw new Error("Title cannot be empty")
        updateData.title = patch.title.trim()
    }
    if (patch.school !== undefined) updateData.school = patch.school?.trim() || null
    if (patch.type !== undefined) updateData.type = patch.type
    if (patch.prompt !== undefined) updateData.prompt = patch.prompt?.trim() || null
    if (patch.word_limit !== undefined) updateData.word_limit = patch.word_limit
    if (patch.status !== undefined) updateData.status = patch.status
    if (patch.deadline !== undefined) updateData.deadline = patch.deadline || null
    if (patch.notes !== undefined) updateData.notes = patch.notes?.trim() || null

    const { error } = await supabase
        .from('essays')
        .update(updateData)
        .eq('id', essayId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/essays')
}

export async function deleteEssay(essayId: string) {
    const userId = await requireUserId()

    const { error } = await supabase
        .from('essays')
        .delete()
        .eq('id', essayId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/essays')
}
