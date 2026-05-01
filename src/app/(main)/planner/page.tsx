
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CareerPath, Task } from "@/types/database";
import { PlannerView } from "./planner-view";

export default async function PlannerPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    // Fetch the always-present fields first so a missing migration on the new
    // school_year_* columns can't break the whole query.
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

    // School year fields live in a separate query; if migration 010 hasn't
    // been applied yet, this fails silently and we fall back to Sept 1 / June 15.
    const { data: schoolYear } = await supabase
        .from('profiles')
        .select('school_year_start_month, school_year_start_day, school_year_end_month, school_year_end_day')
        .eq('id', session.user.id)
        .single();

    return (
        <PlannerView
            graduationYear={profile?.graduation_year ?? new Date().getFullYear() + 4}
            careerPath={(profile?.career_path ?? "Undecided") as CareerPath}
            tasks={(tasks ?? []) as Task[]}
            schoolYearStartMonth={schoolYear?.school_year_start_month ?? 8}
            schoolYearStartDay={schoolYear?.school_year_start_day ?? 1}
            schoolYearEndMonth={schoolYear?.school_year_end_month ?? 5}
            schoolYearEndDay={schoolYear?.school_year_end_day ?? 15}
        />
    );
}
