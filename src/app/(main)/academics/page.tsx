
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AcademicsView } from "./academics-view";
import { Course, Exam } from "@/types/database";

export default async function AcademicsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const userId = session.user.id;

    const [{ data: profile }, { data: courses }, { data: exams }] = await Promise.all([
        supabase
            .from('profiles')
            .select('target_gpa')
            .eq('id', userId)
            .single(),
        supabase
            .from('courses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true }),
        supabase
            .from('exams')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: true }),
    ]);

    return (
        <AcademicsView
            initialCourses={(courses ?? []) as Course[]}
            initialExams={(exams ?? []) as Exam[]}
            targetGpa={profile?.target_gpa ?? null}
        />
    );
}
