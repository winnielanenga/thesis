
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentSeason, getCurrentGrade } from "@/lib/utils";
import { reseedMilestones } from "@/app/(main)/settings/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, BookOpen, Calendar, Brain, GraduationCap, Briefcase,
    FileText, Trophy, CalendarClock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast, isToday } from "date-fns";
import { CurrentDate } from "@/components/current-date";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const userId = session.user.id;

    const [{ data: profile }, { data: nextEssayList }, { data: activities }] = await Promise.all([
        supabase
            .from('profiles')
            .select('target_gpa, dream_colleges, career_path, graduation_year')
            .eq('id', userId)
            .single(),
        supabase
            .from('essays')
            .select('id, title, school, deadline, status, type')
            .eq('user_id', userId)
            .neq('status', 'Submitted')
            .not('deadline', 'is', null)
            .order('deadline', { ascending: true })
            .limit(1),
        supabase
            .from('activities')
            .select('hours_per_week, continue_in_college')
            .eq('user_id', userId),
    ]);

    const gpaGoal = profile?.target_gpa ?? 4.0;
    const dreamColleges: string[] = profile?.dream_colleges ?? [];
    const careerPath = profile?.career_path ?? "Undecided";

    const { data: schoolYear } = await supabase
        .from('profiles')
        .select('school_year_start_month, school_year_start_day')
        .eq('id', userId)
        .single();

    const currentSeason = getCurrentSeason();
    const currentGrade = profile?.graduation_year
        ? getCurrentGrade(
            profile.graduation_year,
            schoolYear?.school_year_start_month ?? 7,
            schoolYear?.school_year_start_day ?? 1,
        )
        : null;

    // Auto-reseed milestones if user has a profile but no milestones at all
    if (profile?.career_path) {
        const { count: totalCount } = await supabase
            .from('user_milestones')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (totalCount === 0) {
            await reseedMilestones(userId, profile.career_path);
        }
    }

    // Count milestones for current season+grade, plus any overdue from past seasons/grades
    let milestoneCount = 0;
    if (currentGrade) {
        const { data: pendingMilestones } = await supabase
            .from('user_milestones')
            .select('milestone_template!inner(grade_level, season)')
            .eq('user_id', userId)
            .eq('status', 'pending');

        milestoneCount = (pendingMilestones ?? []).filter((m) => {
            const t = m.milestone_template as unknown as { grade_level: number; season: string };
            if (!t) return false;
            const grade = t.grade_level;
            const season = t.season;
            if (grade === currentGrade && season === currentSeason) return true;
            const seasonOrder = ['Fall', 'Winter', 'Spring', 'Summer'];
            if (grade < currentGrade) return true;
            if (grade === currentGrade && seasonOrder.indexOf(season) < seasonOrder.indexOf(currentSeason)) return true;
            return false;
        }).length;
    }

    const nextEssay = nextEssayList?.[0] ?? null;
    const activitiesList = activities ?? [];
    const totalHours = activitiesList.reduce((sum, a) => sum + (a.hours_per_week ?? 0), 0);
    const continuingCount = activitiesList.filter(a => a.continue_in_college).length;

    // Compute essay deadline display
    let essayDeadlineLabel: string | null = null;
    let essayDeadlineTone: 'past' | 'soon' | 'ok' = 'ok';
    if (nextEssay?.deadline) {
        const d = new Date(nextEssay.deadline + 'T00:00:00');
        if (isToday(d)) { essayDeadlineLabel = 'Today'; essayDeadlineTone = 'soon'; }
        else if (isPast(d)) { essayDeadlineLabel = `Past due (${format(d, 'MMM d')})`; essayDeadlineTone = 'past'; }
        else {
            const days = differenceInDays(d, new Date());
            if (days <= 7) { essayDeadlineLabel = `In ${days} day${days === 1 ? '' : 's'}`; essayDeadlineTone = 'soon'; }
            else { essayDeadlineLabel = format(d, 'MMM d, yyyy'); essayDeadlineTone = 'ok'; }
        }
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back to your command center.</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    <CurrentDate />
                </div>
            </div>

            {/* Profile / overview row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GPA Goal</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gpaGoal.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">Target GPA</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Milestones</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{milestoneCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {currentSeason === "Summer" && milestoneCount === 0
                                ? "0 summer milestones! Enjoy the break"
                                : milestoneCount === 0
                                    ? `All caught up this ${currentSeason.toLowerCase()}!`
                                    : `${milestoneCount} milestone${milestoneCount === 1 ? '' : 's'} this ${currentSeason.toLowerCase()}`}
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Career Path</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold leading-tight">{careerPath}</div>
                    </CardContent>
                </Card>
                {dreamColleges.length > 0 && (
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dream Schools</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium space-y-1">
                                {dreamColleges.map((college) => (
                                    <div key={college} className="truncate">{college}</div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Application progress row */}
            <div>
                <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Application Progress</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Next Essay Deadline */}
                    <Link href="/essays">
                        <Card className={cn(
                            "glass-card border-none transition-all hover:shadow-md",
                            nextEssay
                                ? "bg-gradient-to-br from-primary to-primary/80 text-white"
                                : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                        )}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-xs uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                                        <CalendarClock className="h-3 w-3" /> Next College Essay Deadline
                                    </div>
                                    <FileText className="h-4 w-4 opacity-60" />
                                </div>
                                {nextEssay ? (
                                    <>
                                        <div className="text-xl font-bold leading-tight">{nextEssay.title}</div>
                                        <div className="text-sm opacity-80 mt-1">
                                            {nextEssay.school ? `${nextEssay.school} · ` : ''}{nextEssay.type}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <div className={cn(
                                                "px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md",
                                                essayDeadlineTone === 'past' ? 'bg-red-500/30' :
                                                    essayDeadlineTone === 'soon' ? 'bg-amber-400/30' :
                                                        'bg-white/20'
                                            )}>
                                                {essayDeadlineLabel}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-base opacity-80 py-2">
                                        No upcoming essay deadlines.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Activities Summary */}
                    <Link href="/activities">
                        <Card className="glass-card transition-all hover:shadow-md h-full">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Trophy className="h-3 w-3" /> Activities
                                    </div>
                                    <Trophy className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {activitiesList.length > 0 ? (
                                    <>
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-3xl font-bold">{activitiesList.length}</div>
                                            <div className="text-sm text-muted-foreground">tracked</div>
                                        </div>
                                        <div className="flex gap-3 mt-3 text-xs">
                                            <div className="bg-gold/15 px-3 py-1.5 rounded-lg">
                                                <span className="font-bold text-amber-700">{totalHours.toFixed(1)}</span>
                                                <span className="text-muted-foreground"> hrs/wk</span>
                                            </div>
                                            <div className="bg-emerald-100 px-3 py-1.5 rounded-lg">
                                                <span className="font-bold text-emerald-700">{continuingCount}</span>
                                                <span className="text-muted-foreground"> continuing</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-sm text-muted-foreground py-2">
                                        No activities yet. Add your first one!
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <Link href="/planner">
                            <Button variant="outline" className="w-full justify-between h-14 text-left">
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Review Roadmap
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/essays">
                            <Button variant="outline" className="w-full justify-between h-14 text-left">
                                <span className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-violet-500" />
                                    Track College Essays
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/activities">
                            <Button variant="outline" className="w-full justify-between h-14 text-left">
                                <span className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-amber-500" />
                                    Log Activities
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/studying">
                            <Button variant="outline" className="w-full justify-between h-14 text-left">
                                <span className="flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-rose-500" />
                                    Start Focus Timer
                                </span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
