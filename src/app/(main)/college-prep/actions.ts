
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { MILESTONES } from "@/data/milestones"

export async function toggleMilestone(
    templateId: string,
    currentStatus: 'pending' | 'completed'
): Promise<{ ok: boolean; error?: string }> {
    const session = await auth()
    if (!session?.user?.id) return { ok: false, error: "Not authenticated" }

    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'

    // Ensure the milestone_template row exists (may not have been seeded
    // during onboarding if the user's grade/path didn't match at that time)
    const template = MILESTONES.find(m => m.id === templateId)
    if (template) {
        const { error: tplErr } = await supabase
            .from('milestone_templates')
            .upsert({
                id: template.id,
                title: template.title!,
                description: template.description ?? null,
                grade_level: template.grade_level!,
                season: template.season ?? null,
                urgency_score: template.urgency_score!,
                path_tags: template.path_tags ?? [],
            }, { onConflict: 'id' })

        if (tplErr) return { ok: false, error: `Template upsert: ${tplErr.message}` }
    }

    // Upsert the user_milestone status
    const { error } = await supabase
        .from('user_milestones')
        .upsert({
            user_id: session.user.id,
            template_id: templateId,
            status: newStatus,
        }, { onConflict: 'user_id,template_id' })

    if (error) return { ok: false, error: error.message }

    revalidatePath("/college-prep")
    return { ok: true }
}
