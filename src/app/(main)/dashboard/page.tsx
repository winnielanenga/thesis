
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, Brain, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const [{ data: profile }, { count: pendingCount }] = await Promise.all([
        supabase
            .from('profiles')
            .select('target_gpa, dream_colleges, career_path')
            .eq('id', session.user.id)
            .single(),
        supabase
            .from('user_milestones')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .eq('status', 'pending'),
    ]);

    const gpaGoal = profile?.target_gpa ?? 4.0;
    const dreamColleges: string[] = profile?.dream_colleges ?? [];
    const careerPath = profile?.career_path ?? "Undecided";
    const milestoneCount = pendingCount ?? 0;

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back to your command center.</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

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
                        <p className="text-xs text-muted-foreground">Pending milestones</p>
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

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link href="/planner">
                            <Button variant="outline" className="w-full justify-between h-14 text-left">
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-purple-500" />
                                    Review Roadmap
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
