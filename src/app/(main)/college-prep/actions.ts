
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function toggleMilestone(templateId: string, currentStatus: 'pending' | 'completed') {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'

    // Try to update existing row
    const { data: existing } = await supabase
        .from('user_milestones')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('template_id', templateId)
        .single()

    if (existing) {
        await supabase
            .from('user_milestones')
            .update({ status: newStatus })
            .eq('id', existing.id)
    } else {
        // If no row exists (e.g. milestone wasn't seeded), create one
        await supabase
            .from('user_milestones')
            .insert({
                user_id: session.user.id,
                template_id: templateId,
                status: newStatus,
            })
    }

    revalidatePath("/college-prep")
}
