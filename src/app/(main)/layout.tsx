
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    GraduationCap,
    Brain,
    LogOut,
    Settings,
    FileText,
    Trophy,
    MessageSquareQuote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    // Fetch Graduation Year for Header
    // Note: session.user.id in NextAuth Google provider is the 'sub'. 
    // We used this 'sub' as the ID in our profiles table during onboarding.
    const today = new Date().toISOString().split('T')[0];
    const twoWeeksOut = new Date();
    twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
    const twoWeeksOutStr = twoWeeksOut.toISOString().split('T')[0];

    const [
        { data: profile },
        { data: pendingMilestones },
        { data: upcomingTasks },
        { data: upcomingEssays },
    ] = await Promise.all([
        supabase
            .from('profiles')
            .select('graduation_year, career_path')
            .eq('id', session.user.id)
            .single(),
        supabase
            .from('user_milestones')
            .select('template_id, status, milestone_template:milestone_templates(title, season, urgency_score)')
            .eq('user_id', session.user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: true })
            .limit(10),
        supabase
            .from('tasks')
            .select('id, title, date, completed')
            .eq('user_id', session.user.id)
            .eq('completed', false)
            .gte('date', today)
            .order('date', { ascending: true })
            .limit(10),
        supabase
            .from('essays')
            .select('id, title, school, deadline, status')
            .eq('user_id', session.user.id)
            .neq('status', 'Submitted')
            .not('deadline', 'is', null)
            .lte('deadline', twoWeeksOutStr)
            .order('deadline', { ascending: true })
            .limit(10),
    ]);

    // Redirect to onboarding if profile is incomplete
    if (!profile?.graduation_year || !profile?.career_path) {
        redirect("/onboarding");
    }

    const gradYear = profile.graduation_year;

    // Build notifications from real data
    type Notification = { id: string; text: string; detail: string; type: 'milestone' | 'task' | 'essay' };
    const notifications: Notification[] = [];

    // Add critical milestones (urgency >= 9)
    (pendingMilestones ?? []).forEach((m: any) => {
        const template = m.milestone_template;
        if (template?.urgency_score >= 9) {
            notifications.push({
                id: `milestone-${m.template_id}`,
                text: template.title,
                detail: `Critical ${template.season} milestone`,
                type: 'milestone',
            });
        }
    });

    // Add upcoming tasks (within next 7 days)
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    (upcomingTasks ?? []).forEach((t: any) => {
        const taskDate = new Date(t.date + 'T00:00:00');
        if (taskDate <= weekFromNow) {
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            const diffDays = Math.round((taskDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
            const timeLabel = diffDays === 0 ? 'Due today' : diffDays === 1 ? 'Due tomorrow' : `Due in ${diffDays} days`;
            notifications.push({
                id: `task-${t.id}`,
                text: t.title,
                detail: timeLabel,
                type: 'task',
            });
        }
    });

    // Add essay deadlines within 14 days
    (upcomingEssays ?? []).forEach((e: any) => {
        const dueDate = new Date(e.deadline + 'T00:00:00');
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
        const timeLabel = diffDays < 0
            ? `Past due (${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago)`
            : diffDays === 0
                ? 'Due today'
                : diffDays === 1
                    ? 'Due tomorrow'
                    : `Due in ${diffDays} days`;
        notifications.push({
            id: `essay-${e.id}`,
            text: e.title,
            detail: e.school ? `${e.school} essay · ${timeLabel}` : `Essay · ${timeLabel}`,
            type: 'essay',
        });
    });

    // If no milestones seeded yet, add a nudge
    if ((pendingMilestones ?? []).length === 0 && (upcomingTasks ?? []).length === 0 && (upcomingEssays ?? []).length === 0) {
        notifications.push({
            id: 'welcome',
            text: 'Welcome to ThesisPrep!',
            detail: 'Check out your College Roadmap to get started.',
            type: 'milestone',
        });
    }

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Planner", href: "/planner", icon: Calendar },
        { name: "Academics", href: "/academics", icon: BookOpen },
        { name: "College Prep", href: "/college-prep", icon: GraduationCap },
        { name: "Essays", href: "/essays", icon: FileText },
        { name: "Rec Letters", href: "/recommendations", icon: MessageSquareQuote },
        { name: "Activities", href: "/activities", icon: Trophy },
        { name: "Studying", href: "/studying", icon: Brain },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-stone-50">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex w-64 flex-col border-r bg-white backdrop-blur-md sticky top-0 h-screen">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        ThesisPrep
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary transition-all"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border m-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                            {session.user?.name?.[0]}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">{session.user?.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{session.user?.email}</div>
                        </div>
                    </div>
                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </Button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header graduationYear={gradYear} notifications={notifications} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
