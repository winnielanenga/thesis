
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { CareerPath } from "@/types/database"

export async function completeOnboarding(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) redirect("/")

    const graduationYear = parseInt(formData.get("graduationYear") as string)
    const careerPath = formData.get("careerPath") as CareerPath

    if (!graduationYear || !careerPath) {
        throw new Error("Missing fields")
    }

    // 1. Get User ID from Supabase Auth (or map email -> id if using NextAuth independent of Supabase Auth)
    // Since we are using NextAuth with Google, we need to ensure the user exists in our 'profiles' table.
    // Ideally, a trigger on auth.users creation handles the initial profile row, 
    // OR we insert/upsert here using the email as a lookup if possible, 
    // BUT Supabase RLS usually keys off 'auth.uid()'. 
    // CHALLENGE: NextAuth session.user.id MIGHT NOT match Supabase auth.uid() unless we use the Supabase Adapter.
    // WORKAROUND: For this V3 MVP without the Adapter yet, we will rely on saving the profile 
    // keyed by the User's Email or a deterministic ID. 
    // BETTER: Let's assume we are using the email to find the user or just Upserting into a 'profiles' table 
    // that we manually manage for now since we aren't using the official Supabase Adapter in this step.
    // WAIT: The prompt said "Supabase JS Client". 
    // Let's use the 'users' table logic: 

    // STRATEGY: 
    // We will assume the `session.user.id` from NextAuth is our primary key.
    // We upsert into `profiles`.

    const userId = session.user.id // This comes from Google Sub usually, which is stable.

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId, // CRITICAL: This ties NextAuth ID to Supabase Profile
            full_name: session.user.name,
            graduation_year: graduationYear,
            career_path: careerPath,
            target_gpa: 4.0 // Default
        })

    if (error) {
        console.error("Profile Error:", error)
        throw new Error("Failed to save profile")
    }

    // 2. Seed Milestones (Simple logic for now)
    // In a real app, we'd fetch from milestone_templates where path_tags contains careerPath
    // and insert into user_milestones.
    // We'll leave this for the "College Prep" phase to implement the robust seeder.

    redirect("/dashboard")
}
