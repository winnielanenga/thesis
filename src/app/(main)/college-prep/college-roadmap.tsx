
"use client";

import { useState, useTransition } from "react";
import { MILESTONES } from "@/data/milestones";
import { CareerPath } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleMilestone } from "./actions";

interface CollegeRoadmapProps {
    userPath: CareerPath;
    completionMap: Record<string, 'pending' | 'completed'>;
    graduationYear: number;
}

function getCurrentGrade(graduationYear: number): 9 | 10 | 11 | 12 {
    const now = new Date();
    const academicStartYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    const hsStartYear = graduationYear - 4;
    const grade = 9 + (academicStartYear - hsStartYear);
    return Math.max(9, Math.min(12, grade)) as 9 | 10 | 11 | 12;
}

export function CollegeRoadmap({ userPath, completionMap, graduationYear }: CollegeRoadmapProps) {
    const [activeGrade, setActiveGrade] = useState(getCurrentGrade(graduationYear));
    const [localMap, setLocalMap] = useState(completionMap);
    const [isPending, startTransition] = useTransition();

    const gradeMilestones = MILESTONES.filter(m =>
        m.grade_level === activeGrade &&
        (m.path_tags?.length === 0 || m.path_tags?.includes(userPath))
    );

    const completedCount = gradeMilestones.filter(m => localMap[m.id] === 'completed').length;
    const totalCount = gradeMilestones.length;

    const handleToggle = (templateId: string) => {
        const current = localMap[templateId] ?? 'pending';
        const next = current === 'pending' ? 'completed' : 'pending';

        // Optimistic update
        setLocalMap(prev => ({ ...prev, [templateId]: next }));

        startTransition(async () => {
            try {
                await toggleMilestone(templateId, current);
            } catch {
                // Revert on error
                setLocalMap(prev => ({ ...prev, [templateId]: current }));
            }
        });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-500">
                        College Roadmap
                    </h1>
                    <p className="text-muted-foreground">
                        Strategic plan for <span className="font-semibold text-foreground">{userPath}</span>
                    </p>
                </div>

                {/* Grade Tabs */}
                <div className="flex bg-secondary/50 p-1 rounded-xl">
                    {([9, 10, 11, 12] as const).map((g) => (
                        <button
                            key={g}
                            onClick={() => setActiveGrade(g)}
                            className={cn(
                                "px-6 py-2 text-sm font-medium rounded-lg transition-all",
                                activeGrade === g
                                    ? "bg-white shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {g}th Grade
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress bar */}
            {totalCount > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{completedCount} of {totalCount} completed</span>
                        <span className="font-medium text-purple-500">{Math.round((completedCount / totalCount) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-violet-500 transition-all duration-500"
                            style={{ width: `${(completedCount / totalCount) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="relative border-l-2 border-purple-100 ml-4 md:ml-8 pl-8 md:pl-12 py-4 space-y-8">
                {gradeMilestones.map((m) => {
                    const status = localMap[m.id] ?? 'pending';
                    const isCompleted = status === 'completed';

                    return (
                        <div key={m.id} className="relative">
                            {/* Timeline Dot */}
                            <div className={cn(
                                "absolute -left-[45px] md:-left-[61px] top-4 h-4 w-4 rounded-full ring-4 ring-white transition-colors",
                                isCompleted ? "bg-emerald-500" : "bg-purple-500"
                            )} />

                            <Card className={cn(
                                "glass-card transition-all group",
                                isCompleted ? "opacity-60 hover:opacity-80" : "hover:border-purple-300"
                            )}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <button
                                        onClick={() => handleToggle(m.id)}
                                        disabled={isPending}
                                        className={cn(
                                            "mt-1 transition-colors",
                                            isCompleted
                                                ? "text-emerald-500 hover:text-muted-foreground"
                                                : "text-muted-foreground hover:text-emerald-500"
                                        )}
                                    >
                                        {isCompleted
                                            ? <CheckCircle2 className="h-6 w-6" />
                                            : <Circle className="h-6 w-6" />
                                        }
                                    </button>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={cn("font-bold text-lg", isCompleted && "line-through")}>{m.title}</h3>
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                                                {m.season}
                                            </span>
                                            {m.urgency_score && m.urgency_score >= 9 && (
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                                                    Critical
                                                </span>
                                            )}
                                        </div>
                                        <p className={cn("text-muted-foreground text-sm", isCompleted && "line-through")}>{m.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

                {gradeMilestones.length === 0 && (
                    <div className="text-muted-foreground italic pl-2">
                        No specific milestones for this period yet. Enjoy the downtime!
                    </div>
                )}
            </div>
        </div>
    );
}
