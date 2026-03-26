
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CareerPath } from "@/types/database";
import { CollegeRoadmap } from "./college-roadmap";

export default async function CollegePrepPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const [{ data: profile }, { data: milestones }] = await Promise.all([
        supabase
            .from('profiles')
            .select('career_path, graduation_year')
            .eq('id', session.user.id)
            .single(),
        supabase
            .from('user_milestones')
            .select('template_id, status')
            .eq('user_id', session.user.id),
    ]);

    const careerPath = (profile?.career_path ?? "Undecided") as CareerPath;

    // Build a map of template_id -> status
    const completionMap: Record<string, 'pending' | 'completed'> = {};
    (milestones ?? []).forEach(m => {
        completionMap[m.template_id] = m.status as 'pending' | 'completed';
    });

    const graduationYear = profile?.graduation_year ?? new Date().getFullYear() + 4;

    return <CollegeRoadmap userPath={careerPath} completionMap={completionMap} graduationYear={graduationYear} />;
}
