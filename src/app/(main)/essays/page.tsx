
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { EssaysView } from "./essays-view";
import { Essay } from "@/types/database";

export default async function EssaysPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const userId = session.user.id;

    const [{ data: essays }, { data: profile }] = await Promise.all([
        supabase
            .from('essays')
            .select('*')
            .eq('user_id', userId)
            .order('deadline', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: true }),
        supabase
            .from('profiles')
            .select('dream_colleges')
            .eq('id', userId)
            .single(),
    ]);

    return (
        <EssaysView
            initialEssays={(essays ?? []) as Essay[]}
            schoolSuggestions={(profile?.dream_colleges ?? []) as string[]}
        />
    );
}
