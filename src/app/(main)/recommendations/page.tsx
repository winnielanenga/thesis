
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RecommendationsView } from "./recommendations-view";
import { Recommendation } from "@/types/database";

export default async function RecommendationsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const { data: recs } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('deadline', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

    return <RecommendationsView initialRecs={(recs ?? []) as Recommendation[]} />;
}
