
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ActivitiesView } from "./activities-view";
import { Activity } from "@/types/database";

export default async function ActivitiesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });

    return <ActivitiesView initialActivities={(activities ?? []) as Activity[]} />;
}
