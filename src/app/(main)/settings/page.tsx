
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SettingsForm } from "./form";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    // Fetch full profile including dream_colleges
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    return <SettingsForm profile={profile} userEmail={session.user.email} />;
}
