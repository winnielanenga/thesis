
"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { MILESTONES } from "@/data/milestones";
import { MilestoneTemplate, Season } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = 'Yearly' | 'Monthly' | 'Weekly';

// --- LOGIC: Seasonal Distribution ---
// Maps Season + Urgency -> Specific Month Index (0-11) relative to Calendar Year
// Note: Academic Year usually starts in Fall. 
// Season Months (approx): 
// Fall: Sept (8), Oct (9), Nov (10)
// Winter: Dec (11), Jan (0), Feb (1)
// Spring: Mar (2), Apr (3), May (4)
// Summer: Jun (5), Jul (6), Aug (7)

const getMonthForMilestone = (season: Season | null, urgency: number): number => {
    if (!season) return 0; // Default Jan if unknown

    // 1. Define Season Start Month (0-indexed)
    let startMonth = 0;
    switch (season) {
        case 'Fall': startMonth = 8; break; // Sept
        case 'Winter': startMonth = 11; break; // Dec (wraps to next year usually)
        case 'Spring': startMonth = 2; break; // Mar
        case 'Summer': startMonth = 5; break; // Jun
    }

    // 2. Adjust based on Urgency (High = Earlier)
    // 3-month block per season usually.
    // Urgency 8-10 -> Month 0 (Start)
    // Urgency 4-7  -> Month 1 (Mid)
    // Urgency 1-3  -> Month 2 (End)
    let offset = 0;
    if (urgency >= 8) offset = 0;
    else if (urgency >= 4) offset = 1;
    else offset = 2;

    // Handle Winter wrap-around (Dec(11) + 1 = 12 -> Jan(0))
    // Simple modulo 12
    return (startMonth + offset) % 12;
};

export default function PlannerPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('Monthly');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Filter milestones for current view context
    // In real app, filter by User Grade + Career Path
    const relevantMilestones = MILESTONES;

    // Distribute milestones to months (pre-process or on-fly)
    const distributedMilestones = relevantMilestones.map(m => ({
        ...m,
        assignedMonth: getMonthForMilestone(m.season as Season, m.urgency_score || 5)
    }));

    const getMilestonesForMonth = (monthIndex: number) => {
        return distributedMilestones.filter(m => m.assignedMonth === monthIndex);
    };

    const handlePrev = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNext = () => setCurrentDate(addMonths(currentDate, 1));

    return (
        <div className="space-y-6 h-full flex flex-col p-8">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Planner</h1>
                    <p className="text-muted-foreground">Manage your deadlines and seasonal goals.</p>
                </div>

                <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
                    <Button
                        variant={viewMode === 'Yearly' ? 'secondary' : 'ghost'}
                        size="sm" onClick={() => setViewMode('Yearly')}>Yearly</Button>
                    <Button
                        variant={viewMode === 'Monthly' ? 'secondary' : 'ghost'}
                        size="sm" onClick={() => setViewMode('Monthly')}>Monthly</Button>
                    <Button
                        variant={viewMode === 'Weekly' ? 'secondary' : 'ghost'}
                        size="sm" onClick={() => setViewMode('Weekly')}>Weekly</Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
                    <div className="w-[140px] text-center font-medium">
                        {format(currentDate, 'MMMM yyyy')}
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* VIEWS */}
            <div className="flex-1 min-h-[500px] border rounded-3xl bg-white/50 dark:bg-black/20 glass-card p-6 overflow-hidden">

                {/* YEARLY VIEW */}
                {viewMode === 'Yearly' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full overflow-y-auto">
                        {Array.from({ length: 12 }).map((_, idx) => {
                            const monthDate = new Date(currentDate.getFullYear(), idx, 1);
                            const ms = getMilestonesForMonth(idx);

                            return (
                                <div key={idx} className="border rounded-xl p-3 bg-white/50 dark:bg-black/30 flex flex-col gap-2 hover:border-indigo-300 transition-colors">
                                    <div className="font-bold text-sm text-muted-foreground">{format(monthDate, 'MMMM')}</div>
                                    <div className="flex-1 space-y-2">
                                        {ms.length > 0 ? ms.map((m, i) => (
                                            <div key={i} className="text-[10px] p-1.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 truncate">
                                                {m.title}
                                            </div>
                                        )) : (
                                            <div className="text-[10px] text-muted-foreground/30 italic">No milestones</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* MONTHLY VIEW */}
                {viewMode === 'Monthly' && (
                    <div className="h-full flex flex-col">
                        <div className="grid grid-cols-7 mb-2 text-center font-medium text-sm text-muted-foreground">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 grid-rows-5 gap-1 flex-1">
                            {eachDayOfInterval({
                                start: startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)),
                                end: endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
                            }).slice(0, 35).map((day, idx) => {
                                const isCurrent = isSameMonth(day, currentDate);
                                // For monthly view, we just show marks if milestones exist for this month generally, 
                                // OR if we had specific dates. For now, since milestones are "Seasonal",
                                // we might just list them in a sidebar or distribute them to "Monday of Week 1".
                                // Let's just visualize the grid for now.
                                return (
                                    <div key={idx} className={cn(
                                        "border rounded-lg p-1 bg-white/40 dark:bg-black/20",
                                        !isCurrent && "opacity-30 bg-muted/20"
                                    )}>
                                        <div className="text-right text-xs text-muted-foreground">{format(day, 'd')}</div>
                                    </div>
                                )
                            })}
                        </div>
                        {/* Sidebar/Footer for Month's Milestones */}
                        <div className="mt-4 pt-4 border-t">
                            <h3 className="font-bold text-sm mb-2">Milestones for {format(currentDate, 'MMMM')}</h3>
                            <div className="flex gap-2 flex-wrap">
                                {getMilestonesForMonth(currentDate.getMonth()).map((m, i) => (
                                    <div key={i} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                                        {m.title}
                                    </div>
                                ))}
                                {getMilestonesForMonth(currentDate.getMonth()).length === 0 && (
                                    <span className="text-xs text-muted-foreground italic">Nothing scheduled for this month. Focus on grades!</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'Weekly' && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <List className="h-12 w-12 mb-4 opacity-20" />
                        <p>Weekly granular view coming soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
