
"use client";

import { useState, useMemo, useTransition } from "react";
import {
    format, addMonths, subMonths, addWeeks, subWeeks, addDays,
    startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    eachDayOfInterval, eachWeekOfInterval,
    isSameMonth, isSameDay, isSameWeek, isBefore, isWithinInterval,
} from "date-fns";
import { MILESTONES } from "@/data/milestones";
import { CareerPath, Season, Task } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Plus, Check, Circle, Trash2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addTask, toggleTask, deleteTask } from "./actions";
import { useCelebration } from "@/hooks/use-celebration";

type ViewMode = 'Yearly' | 'Monthly' | 'Weekly';

// Season start dates relative to an academic year starting in September
const SEASON_START_MONTH: Record<Season, number> = {
    'Fall': 8,    // Sept
    'Winter': 11, // Dec
    'Spring': 2,  // Mar
    'Summer': 5,  // Jun
};
const SEASON_END_MONTH: Record<Season, number> = {
    'Fall': 10,   // Nov
    'Winter': 1,  // Feb
    'Spring': 4,  // May
    'Summer': 7,  // Aug
};

function getSeasonDateRange(grade: number, season: Season, hsStartYear: number) {
    const offset = grade - 9;
    const acadYear = hsStartYear + offset;
    const startMonth = SEASON_START_MONTH[season];
    const endMonth = SEASON_END_MONTH[season];

    // Fall/Winter(Dec) start in acadYear; Winter(Jan-Feb)/Spring/Summer in acadYear+1
    const startYear = startMonth >= 8 ? acadYear : acadYear + 1;
    const endYear = endMonth >= 8 ? acadYear : acadYear + 1;

    return {
        start: new Date(startYear, startMonth, 1),
        end: endOfMonth(new Date(endYear, endMonth, 1)),
    };
}

interface DistributedMilestone {
    id: string;
    title: string;
    description: string | null | undefined;
    season: Season;
    urgency_score: number;
    grade_level: number;
    path_tags: CareerPath[];
    assignedWeekStart: Date; // the Monday (or Sunday) of the assigned week
}

interface PlannerViewProps {
    graduationYear: number;
    careerPath: CareerPath;
    tasks: Task[];
    schoolYearStartMonth: number; // 0-11
    schoolYearStartDay: number;   // 1-31
    schoolYearEndMonth: number;   // 0-11
    schoolYearEndDay: number;     // 1-31
}

export function PlannerView({
    graduationYear, careerPath, tasks,
    schoolYearStartMonth, schoolYearStartDay,
    schoolYearEndMonth, schoolYearEndDay,
}: PlannerViewProps) {
    const hsStartYear = graduationYear - 4;
    const hsStartDate = new Date(hsStartYear, schoolYearStartMonth, schoolYearStartDay);
    const hsStartWeek = startOfWeek(hsStartDate);

    const now = new Date();
    // Decide which academic year today falls in, using the user's actual start date
    // (not just a generic August cutoff). If we're past this calendar year's start, the
    // academic year started this year; otherwise it started last year.
    const thisYearStart = new Date(now.getFullYear(), schoolYearStartMonth, schoolYearStartDay);
    const currentAcademicStartYear = now >= thisYearStart ? now.getFullYear() : now.getFullYear() - 1;
    const currentGrade = Math.max(9, Math.min(12, 9 + (currentAcademicStartYear - hsStartYear)));

    const defaultDate = isBefore(now, hsStartDate)
        ? hsStartDate
        : new Date(currentAcademicStartYear, schoolYearStartMonth, schoolYearStartDay);
    const [viewMode, setViewMode] = useState<ViewMode>('Monthly');
    const [currentDate, setCurrentDate] = useState(defaultDate);
    const [showAddTask, setShowAddTask] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { miniPop } = useCelebration();

    // Distribute milestones evenly across weeks of their season
    const distributedMilestones = useMemo(() => {
        const filtered = MILESTONES.filter(m => {
            if (!m.grade_level) return false;
            const tags = m.path_tags ?? [];
            return tags.length === 0 || tags.includes(careerPath);
        });

        const result: DistributedMilestone[] = [];

        // Group by grade+season
        const groups = new Map<string, typeof filtered>();
        for (const m of filtered) {
            const key = `${m.grade_level}-${m.season}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(m);
        }

        for (const [key, milestones] of groups) {
            const grade = milestones[0].grade_level!;
            const season = milestones[0].season as Season;
            const range = getSeasonDateRange(grade, season, hsStartYear);
            const weeks = eachWeekOfInterval({ start: range.start, end: range.end });

            if (weeks.length === 0) continue;

            // Sort by urgency descending (most urgent assigned to earliest weeks)
            const sorted = [...milestones].sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0));

            // Distribute round-robin across available weeks
            sorted.forEach((m, i) => {
                const weekIdx = i % weeks.length;
                result.push({
                    id: m.id,
                    title: m.title!,
                    description: m.description,
                    season,
                    urgency_score: m.urgency_score || 5,
                    grade_level: grade,
                    path_tags: (m.path_tags ?? []) as CareerPath[],
                    assignedWeekStart: weeks[weekIdx],
                });
            });
        }

        return result;
    }, [careerPath, hsStartYear]);

    // Get milestones assigned to a specific week
    const getMilestonesForWeek = (weekStart: Date) => {
        return distributedMilestones.filter(m => isSameWeek(m.assignedWeekStart, weekStart));
    };

    // Get milestones for a year+month
    // Use the week's midpoint (Wednesday) to decide which month it belongs to,
    // so a week starting Sunday Aug 29 with midpoint Wed Sept 1 counts as September.
    const getMilestonesForYearMonth = (year: number, month: number) => {
        return distributedMilestones.filter(m => {
            const midpoint = addDays(m.assignedWeekStart, 3); // Wednesday
            return midpoint.getFullYear() === year && midpoint.getMonth() === month;
        });
    };

    const getMilestonesForCurrentMonth = () => {
        return getMilestonesForYearMonth(currentDate.getFullYear(), currentDate.getMonth());
    };

    // Tasks for a specific week
    const getTasksForWeek = (weekStart: Date) => {
        const weekEnd = endOfWeek(weekStart);
        return tasks.filter(t => {
            const d = new Date(t.date + 'T00:00:00');
            return isWithinInterval(d, { start: weekStart, end: weekEnd });
        });
    };

    // Tasks for a specific month
    const getTasksForMonth = (year: number, month: number) => {
        return tasks.filter(t => {
            const d = new Date(t.date + 'T00:00:00');
            return d.getFullYear() === year && d.getMonth() === month;
        });
    };

    // Navigation — yearly jumps by 12 months (one academic year)
    const getStep = (direction: 'prev' | 'next') => {
        if (viewMode === 'Yearly') return direction === 'prev' ? subMonths(currentDate, 12) : addMonths(currentDate, 12);
        if (viewMode === 'Weekly') return direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
        return direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    };
    const handlePrev = () => {
        const candidate = getStep('prev');
        if (!isBefore(candidate, hsStartWeek)) setCurrentDate(candidate);
    };
    const handleNext = () => {
        setCurrentDate(getStep('next'));
    };
    const canGoPrev = !isBefore(getStep('prev'), hsStartWeek);

    // HS week number
    const getHsWeekNumber = (date: Date) => {
        const diff = startOfWeek(date).getTime() - hsStartWeek.getTime();
        return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
    };

    // Weekly view data
    const getWeeklyData = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        let weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
        weeks = weeks.filter(w => !isBefore(endOfWeek(w), hsStartDate));

        return weeks.map((weekStart) => {
            const milestones = getMilestonesForWeek(weekStart);
            const weekTasks = getTasksForWeek(weekStart);
            return {
                weekStart,
                weekEnd: endOfWeek(weekStart),
                milestones,
                tasks: weekTasks,
                totalItems: milestones.length + weekTasks.length,
                hsWeek: getHsWeekNumber(weekStart),
            };
        });
    };

    // Yearly academic months — first month is whatever the user said school starts
    const getViewedAcademicStartYear = () => {
        return currentDate.getMonth() >= schoolYearStartMonth
            ? currentDate.getFullYear()
            : currentDate.getFullYear() - 1;
    };

    const academicMonths = useMemo(() => {
        const viewedAcadYear = currentDate.getMonth() >= schoolYearStartMonth
            ? currentDate.getFullYear()
            : currentDate.getFullYear() - 1;
        const acadYear = Math.max(viewedAcadYear, hsStartYear);
        return Array.from({ length: 12 }).map((_, i) => {
            const monthIndex = (schoolYearStartMonth + i) % 12;
            const year = monthIndex >= schoolYearStartMonth ? acadYear : acadYear + 1;
            return { monthIndex, year, date: new Date(year, monthIndex, 1) };
        });
    }, [currentDate, hsStartYear, schoolYearStartMonth]);

    const viewedGrade = Math.max(9, Math.min(12, 9 + (getViewedAcademicStartYear() - hsStartYear)));

    // Add task handler
    const handleAddTask = (formData: FormData) => {
        startTransition(async () => {
            await addTask(formData);
            setShowAddTask(false);
        });
    };

    const handleToggleTask = (taskId: string, completed: boolean, e?: React.MouseEvent) => {
        // Mini pop when completing (not uncompleting) a task
        if (!completed) miniPop(e);
        startTransition(() => toggleTask(taskId, !completed));
    };

    const handleDeleteTask = (taskId: string) => {
        startTransition(() => deleteTask(taskId));
    };

    // Default date for new task: Monday of the currently viewed week
    const getDefaultTaskDate = () => {
        const ws = startOfWeek(currentDate);
        const monday = addDays(ws, 1); // Sunday + 1 = Monday
        return format(monday, 'yyyy-MM-dd');
    };

    return (
        <div className="space-y-6 h-full flex flex-col p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Planner</h1>
                    <p className="text-muted-foreground">
                        {viewedGrade}th Grade &middot; Class of {graduationYear}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
                    <Button variant={viewMode === 'Yearly' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('Yearly')}>Yearly</Button>
                    <Button variant={viewMode === 'Monthly' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('Monthly')}>Monthly</Button>
                    <Button variant={viewMode === 'Weekly' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('Weekly')}>Weekly</Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrev} disabled={!canGoPrev}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-[280px] text-center font-medium text-sm">
                        {viewMode === 'Yearly'
                            ? `${getViewedAcademicStartYear()} – ${getViewedAcademicStartYear() + 1}`
                            : viewMode === 'Weekly'
                            ? `Week ${getHsWeekNumber(currentDate)} · ${format(startOfWeek(currentDate), 'MMM d')} – ${format(endOfWeek(currentDate), 'MMM d')}`
                            : format(currentDate, 'MMMM yyyy')
                        }
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* VIEWS */}
            <div className="flex-1 min-h-[500px] border rounded-3xl bg-white/50 glass-card p-6 overflow-hidden">

                {/* YEARLY VIEW */}
                {viewMode === 'Yearly' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full overflow-y-auto">
                        {academicMonths.map(({ monthIndex, year, date }) => {
                            const ms = getMilestonesForYearMonth(year, monthIndex);
                            const ts = getTasksForMonth(year, monthIndex);
                            return (
                                <div
                                    key={`${year}-${monthIndex}`}
                                    className={cn(
                                        "border rounded-xl p-3 bg-white/50 flex flex-col gap-2 hover:border-primary/30 transition-colors cursor-pointer",
                                        isSameMonth(date, new Date()) && "border-primary ring-1 ring-primary/30"
                                    )}
                                    onClick={() => { setCurrentDate(date); setViewMode('Monthly'); }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-sm text-muted-foreground">{format(date, 'MMMM yyyy')}</div>
                                        {(ms.length + ts.length) > 0 && (
                                            <span className="text-[10px] font-medium text-muted-foreground">{ms.length + ts.length} items</span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {ms.length > 0 ? ms.slice(0, 4).map((m) => (
                                            <div key={m.id} className="text-[10px] p-1.5 rounded bg-primary/5 text-primary border border-primary/10 truncate">
                                                {m.title}
                                            </div>
                                        )) : (
                                            <div className="text-[10px] text-muted-foreground/30 italic">No milestones</div>
                                        )}
                                        {ms.length > 4 && (
                                            <div className="text-[10px] text-muted-foreground">+{ms.length - 4} more</div>
                                        )}
                                        {ts.map((t) => (
                                            <div key={t.id} className={cn("text-[10px] p-1.5 rounded border truncate", t.completed ? "bg-emerald-50 text-emerald-600 border-emerald-100 line-through opacity-60" : "bg-amber-50 text-amber-700 border-amber-100")}>
                                                {t.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MONTHLY VIEW */}
                {viewMode === 'Monthly' && (() => {
                    const monthStart = startOfMonth(currentDate);
                    const monthEnd = endOfMonth(currentDate);
                    // Build weeks explicitly: from the Sunday on/before the 1st of the
                    // month, through the Sunday on/before the last of the month. Not
                    // using eachWeekOfInterval because it can yield off-by-one results.
                    const weeks: Date[] = [];
                    for (let w = startOfWeek(monthStart); w <= startOfWeek(monthEnd); w = addWeeks(w, 1)) {
                        weeks.push(w);
                    }
                    // Don't filter out weeks before HS — per-day greying below handles
                    // pre-HS visually.

                    return (
                        <div className="h-full flex flex-col gap-4 overflow-y-auto">
                            {/* Day-of-week header */}
                            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1 text-center text-xs font-medium text-muted-foreground sticky top-0 bg-white/50 backdrop-blur-sm pb-2">
                                <div></div>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                            </div>

                            {/* Week rows */}
                            {weeks.map((weekStart) => {
                                const days = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart) });
                                const weekMilestones = getMilestonesForWeek(weekStart);
                                const weekTasks = getTasksForWeek(weekStart);
                                const hsWeek = getHsWeekNumber(weekStart);
                                const totalItems = weekMilestones.length + weekTasks.length;

                                return (
                                    <div key={weekStart.toISOString()} className="grid grid-cols-[100px_repeat(7,1fr)] gap-1">
                                        {/* Week label — clickable to drill into weekly view */}
                                        <button
                                            onClick={() => { setCurrentDate(weekStart); setViewMode('Weekly'); }}
                                            className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 hover:bg-primary/10 hover:text-primary transition-colors p-2 text-center"
                                        >
                                            <span className="text-xs font-bold">Wk {hsWeek}</span>
                                            <span className="text-[10px] text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                                        </button>

                                        {/* Day cells */}
                                        {days.map((day) => {
                                            const inMonth = isSameMonth(day, currentDate);
                                            const beforeHs = isBefore(day, hsStartDate);
                                            const dayTasks = tasks.filter(t => t.date === format(day, 'yyyy-MM-dd'));
                                            return (
                                                <div key={day.toISOString()} className={cn(
                                                    "border rounded-lg p-1.5 bg-white/40 min-h-[70px]",
                                                    (!inMonth || beforeHs) && "opacity-20",
                                                    isSameDay(day, new Date()) && "border-primary ring-1 ring-primary/30"
                                                )}>
                                                    <div className="text-right text-xs text-muted-foreground mb-1">{format(day, 'd')}</div>
                                                    {dayTasks.map(t => (
                                                        <div key={t.id} className={cn(
                                                            "text-[9px] truncate px-1.5 py-0.5 rounded mb-0.5",
                                                            t.completed
                                                                ? "bg-emerald-900/20 text-emerald-400 line-through"
                                                                : "bg-amber-900/20 text-amber-400"
                                                        )}>
                                                            {t.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}

                                        {/* Milestones row spanning full width under the day cells */}
                                        {weekMilestones.length > 0 && (
                                            <div className="col-start-1 col-span-8 flex gap-2 flex-wrap px-1 pb-2">
                                                {weekMilestones.map(m => (
                                                    <div key={m.id} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md bg-primary/5 text-primary border border-primary/10">
                                                        {m.urgency_score >= 9 && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                                        )}
                                                        {m.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Summary footer */}
                            {getMilestonesForCurrentMonth().length === 0 && tasks.filter(t => {
                                const d = new Date(t.date + 'T00:00:00');
                                return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
                            }).length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No milestones or tasks this month. Focus on grades!
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* WEEKLY VIEW */}
                {viewMode === 'Weekly' && (() => {
                    const weeklyData = getWeeklyData();
                    const activeWeek = weeklyData.find(w => isSameWeek(currentDate, w.weekStart)) || weeklyData[0];

                    return (
                        <div className="h-full flex flex-col gap-5">
                            {/* Week tabs */}
                            <div className="flex gap-2 flex-wrap">
                                {weeklyData.map((w) => (
                                    <button
                                        key={w.hsWeek}
                                        onClick={() => setCurrentDate(w.weekStart)}
                                        className={cn(
                                            "px-4 py-2 text-xs font-medium rounded-lg transition-all",
                                            isSameWeek(currentDate, w.weekStart)
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Week {w.hsWeek}
                                        <span className="ml-1.5 opacity-70">
                                            ({w.totalItems} {w.totalItems === 1 ? 'task' : 'tasks'})
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Day columns */}
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                                {eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) }).map(day => (
                                    <div key={day.toISOString()} className={cn(
                                        "py-1 rounded-md",
                                        isSameDay(day, new Date()) && "bg-primary/20 text-primary font-bold"
                                    )}>
                                        {format(day, 'EEE d')}
                                    </div>
                                ))}
                            </div>

                            {/* Content: milestones + tasks + add button */}
                            <div className="flex-1 overflow-y-auto space-y-3">
                                {/* Milestones */}
                                {activeWeek?.milestones.map((m) => (
                                    <Card key={m.id} className="glass-card hover:border-primary/30 transition-all">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-primary">
                                                            Milestone
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold">{m.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{m.description}</p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {m.season && (
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-primary">
                                                            {m.season}
                                                        </span>
                                                    )}
                                                    {m.urgency_score >= 9 && (
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                                                            Critical
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* User tasks */}
                                {activeWeek?.tasks.map((t) => (
                                    <Card key={t.id} className={cn("glass-card transition-all", t.completed && "opacity-60")}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => handleToggleTask(t.id, t.completed, e)}
                                                        className={cn("transition-colors", t.completed ? "text-emerald-500" : "text-muted-foreground hover:text-emerald-500")}
                                                        disabled={isPending}
                                                    >
                                                        {t.completed ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                                    </button>
                                                    <div>
                                                        <h3 className={cn("font-medium", t.completed && "line-through")}>{t.title}</h3>
                                                        <p className="text-xs text-muted-foreground">{format(new Date(t.date + 'T00:00:00'), 'EEEE, MMM d')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {t.category && (
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                                                            {t.category}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteTask(t.id)}
                                                        className="text-muted-foreground hover:text-red-500 transition-colors"
                                                        disabled={isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Empty state */}
                                {activeWeek && activeWeek.totalItems === 0 && !showAddTask && (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <CalendarIcon className="h-10 w-10 mb-3 opacity-20" />
                                        <p className="text-sm">No tasks this week.</p>
                                    </div>
                                )}

                                {/* Add task form */}
                                {showAddTask ? (
                                    <Card className="glass-card border-primary/30">
                                        <CardContent className="p-4">
                                            <form action={handleAddTask} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-sm">Add a task</h3>
                                                    <button type="button" onClick={() => setShowAddTask(false)} className="text-muted-foreground hover:text-foreground">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <Input
                                                    name="title"
                                                    placeholder="e.g. Math HW, English Paper"
                                                    required
                                                    autoFocus
                                                    className="h-10"
                                                />
                                                <div className="flex gap-2">
                                                    <Input
                                                        name="date"
                                                        type="date"
                                                        defaultValue={getDefaultTaskDate()}
                                                        required
                                                        className="h-10 flex-1"
                                                    />
                                                    <select
                                                        name="category"
                                                        className="h-10 rounded-md border bg-transparent px-3 text-sm flex-1"
                                                        defaultValue=""
                                                    >
                                                        <option value="">No category</option>
                                                        <option value="Academics">Academics</option>
                                                        <option value="Extracurricular">Extracurricular</option>
                                                        <option value="College Prep">College Prep</option>
                                                        <option value="Personal">Personal</option>
                                                    </select>
                                                </div>
                                                <Button type="submit" size="sm" disabled={isPending} className="w-full">
                                                    {isPending ? "Adding..." : "Add Task"}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <button
                                        onClick={() => setShowAddTask(true)}
                                        className="w-full py-3 border-2 border-dashed border-muted-foreground/20 rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" /> Add a task
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
