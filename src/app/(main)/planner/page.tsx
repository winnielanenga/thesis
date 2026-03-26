
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CareerPath, Task } from "@/types/database";
import { PlannerView } from "./planner-view";

export default async function PlannerPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const [{ data: profile }, { data: tasks }] = await Promise.all([
        supabase
            .from('profiles')
            .select('graduation_year, career_path')
            .eq('id', session.user.id)
            .single(),
        supabase
            .from('tasks')
            .select('*')
            .eq('user_id', session.user.id)
            .order('date', { ascending: true }),
    ]);

    return (
        <PlannerView
            graduationYear={profile?.graduation_year ?? new Date().getFullYear() + 4}
            careerPath={(profile?.career_path ?? "Undecided") as CareerPath}
            tasks={(tasks ?? []) as Task[]}
        />
    );
}
