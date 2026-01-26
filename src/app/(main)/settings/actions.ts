
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { CareerPath } from "@/types/database"

export async function updateProfile(data: { careerPath?: CareerPath; dreamColleges?: string[] }) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const updateData: any = {}
    if (data.careerPath) updateData.career_path = data.careerPath
    if (data.dreamColleges) updateData.dream_colleges = data.dreamColleges

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/settings')
    revalidatePath('/college-prep') // Revalidate roadmap
}

export async function resetAccount() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Delete all user data
    // Dependent tables (user_milestones, tasks) should cascade if defined in schema, 
    // but let's be explicit if we can, or just delete profile if cascade is on.
    // Actually, our schema didn't define ON DELETE CASCADE explicitly in the setup script for all FKs.
    // Let's do it manually to range-check.

    const userId = session.user.id

    await supabase.from('user_milestones').delete().eq('user_id', userId)
    await supabase.from('tasks').delete().eq('user_id', userId)
    await supabase.from('profiles').delete().eq('id', userId) // This might effectively kill the account in our app logic

    // In a real app we might revoke Auth too, but for now just data wipe.

    return { success: true }
}
