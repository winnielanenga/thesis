
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function addTask(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const title = (formData.get("title") as string)?.trim()
    const date = formData.get("date") as string // YYYY-MM-DD
    const category = (formData.get("category") as string) || null

    if (!title || !date) throw new Error("Title and date are required")

    const { error } = await supabase
        .from('tasks')
        .insert({
            user_id: session.user.id,
            title,
            date,
            completed: false,
            category,
        })

    if (error) {
        console.error("Add task error:", error)
        throw new Error("Failed to add task")
    }

    revalidatePath("/planner")
}

export async function toggleTask(taskId: string, completed: boolean) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId)
        .eq('user_id', session.user.id)

    if (error) {
        console.error("Toggle task error:", error)
        throw new Error("Failed to update task")
    }

    revalidatePath("/planner")
}

export async function deleteTask(taskId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', session.user.id)

    if (error) {
        console.error("Delete task error:", error)
        throw new Error("Failed to delete task")
    }

    revalidatePath("/planner")
}
