
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { RecStatus, RecommenderType } from "@/types/database"

const VALID_TYPES: RecommenderType[] = ['Teacher', 'Counselor', 'Coach', 'Employer', 'Other']
const VALID_STATUSES: RecStatus[] = ['Not Asked', 'Asked', 'Confirmed', 'Submitted', 'Declined']

async function requireUserId(): Promise<string> {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    return session.user.id
}

export interface RecommendationInput {
    recommender_name: string
    recommender_role?: string | null
    email?: string | null
    type: RecommenderType
    status?: RecStatus
    requested_date?: string | null
    deadline?: string | null
    notes?: string | null
}

function validate(input: Partial<RecommendationInput>) {
    if (input.type !== undefined && !VALID_TYPES.includes(input.type)) {
        throw new Error("Invalid recommender type")
    }
    if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
        throw new Error("Invalid status")
    }
}

export async function addRecommendation(input: RecommendationInput) {
    const userId = await requireUserId()
    validate(input)

    if (!input.recommender_name?.trim()) throw new Error("Recommender name is required")

    const { data, error } = await supabase
        .from('recommendations')
        .insert({
            user_id: userId,
            recommender_name: input.recommender_name.trim(),
            recommender_role: input.recommender_role?.trim() || null,
            email: input.email?.trim() || null,
            type: input.type,
            status: input.status ?? 'Not Asked',
            requested_date: input.requested_date || null,
            deadline: input.deadline || null,
            notes: input.notes?.trim() || null,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/recommendations')
    return data
}

export async function updateRecommendation(recId: string, patch: Partial<RecommendationInput>) {
    const userId = await requireUserId()
    validate(patch)

    const updateData: Record<string, unknown> = {}
    if (patch.recommender_name !== undefined) {
        if (!patch.recommender_name.trim()) throw new Error("Recommender name cannot be empty")
        updateData.recommender_name = patch.recommender_name.trim()
    }
    if (patch.recommender_role !== undefined) updateData.recommender_role = patch.recommender_role?.trim() || null
    if (patch.email !== undefined) updateData.email = patch.email?.trim() || null
    if (patch.type !== undefined) updateData.type = patch.type
    if (patch.status !== undefined) {
        updateData.status = patch.status
        // Auto-set requested_date when transitioning to Asked, if not already set
        if (patch.status === 'Asked' && patch.requested_date === undefined) {
            const { data: existing } = await supabase
                .from('recommendations')
                .select('requested_date')
                .eq('id', recId)
                .eq('user_id', userId)
                .single()
            if (existing && !existing.requested_date) {
                updateData.requested_date = new Date().toISOString().split('T')[0]
            }
        }
    }
    if (patch.requested_date !== undefined) updateData.requested_date = patch.requested_date || null
    if (patch.deadline !== undefined) updateData.deadline = patch.deadline || null
    if (patch.notes !== undefined) updateData.notes = patch.notes?.trim() || null

    const { error } = await supabase
        .from('recommendations')
        .update(updateData)
        .eq('id', recId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/recommendations')
}

export async function deleteRecommendation(recId: string) {
    const userId = await requireUserId()

    const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', recId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/recommendations')
}
