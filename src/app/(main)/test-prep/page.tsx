
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TestPrepView } from "./test-prep-view";
import { TestAttempt } from "@/types/database";

export default async function TestPrepPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const { data: attempts } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('test_date', { ascending: false });

    return <TestPrepView initialAttempts={(attempts ?? []) as TestAttempt[]} />;
}
