
"use client";

import { useState } from "react";
import { MILESTONES } from "@/data/milestones";
import { CareerPath } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CollegePrepPage() {
    const [activeGrade, setActiveGrade] = useState(9);
    // Mock user profile for now - in real app, fetch from Context/Supabase
    const userPath: CareerPath = "Computer Science";

    // Filter milestones for this grade
    // AND (generic OR specific to user's path)
    const gradeMilestones = MILESTONES.filter(m =>
        m.grade_level === activeGrade &&
        (m.path_tags?.length === 0 || m.path_tags?.includes(userPath))
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        College Roadmap
                    </h1>
                    <p className="text-muted-foreground">
                        Strategic plan for <span className="font-semibold text-foreground">{userPath}</span>
                    </p>
                </div>

                {/* Grade Tabs */}
                <div className="flex bg-secondary/50 p-1 rounded-xl">
                    {[9, 10, 11, 12].map((g) => (
                        <button
                            key={g}
                            onClick={() => setActiveGrade(g)}
                            className={cn(
                                "px-6 py-2 text-sm font-medium rounded-lg transition-all",
                                activeGrade === g
                                    ? "bg-white dark:bg-black shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {g}th Grade
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900 ml-4 md:ml-8 pl-8 md:pl-12 py-4 space-y-8">
                {gradeMilestones.map((m, idx) => (
                    <div key={idx} className="relative">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[45px] md:-left-[61px] top-4 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-black"></div>

                        <Card className="glass-card hover:border-indigo-300 transition-all group">
                            <CardContent className="p-4 flex items-start gap-4">
                                <button className="mt-1 text-muted-foreground hover:text-emerald-500 transition-colors">
                                    <Circle className="h-6 w-6" />
                                </button>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">{m.title}</h3>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            {m.season}
                                        </span>
                                        {m.urgency_score && m.urgency_score >= 9 && (
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                Critical
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-sm">{m.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {gradeMilestones.length === 0 && (
                    <div className="text-muted-foreground italic pl-2">
                        No specific milestones for this period yet. Enjoy the downtime!
                    </div>
                )}
            </div>
        </div>
    );
}
