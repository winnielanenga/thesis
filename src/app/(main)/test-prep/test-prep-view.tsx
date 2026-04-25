
"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Plus, X, Pencil, Loader2, CalendarClock, Trophy, BarChart3, Target, BookCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast, isToday } from "date-fns";
import { TestAttempt, TestType } from "@/types/database";
import {
    addTestAttempt, updateTestAttempt, deleteTestAttempt, TestAttemptInput,
} from "./actions";

const TYPE_COLOR: Record<TestType, string> = {
    'SAT': 'bg-primary/10 text-primary',
    'ACT': 'bg-blue-100 text-blue-700',
    'PSAT': 'bg-violet-100 text-violet-700',
    'AP': 'bg-emerald-100 text-emerald-700',
    'Subject Test': 'bg-amber-100 text-amber-700',
    'Other': 'bg-muted text-muted-foreground',
};

// Typical score ranges per test type — used to guide the progress bar
// only. Server still enforces the 0-2400 absolute range.
const SCORE_MAX: Record<TestType, number> = {
    'SAT': 1600,
    'ACT': 36,
    'PSAT': 1520,
    'AP': 5,
    'Subject Test': 800,
    'Other': 100,
};

export function TestPrepView({ initialAttempts }: { initialAttempts: TestAttempt[] }) {
    const [attempts, setAttempts] = useState<TestAttempt[]>(initialAttempts);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [, startTransition] = useTransition();
    const [pending, setPending] = useState(0);

    const runWithPending = (fn: () => Promise<void>) => {
        setPending(p => p + 1);
        startTransition(async () => {
            try { await fn(); } finally { setPending(p => p - 1); }
        });
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = useMemo(
        () => attempts
            .filter(a => {
                const d = new Date(a.test_date + 'T00:00:00');
                return d >= today;
            })
            .sort((a, b) => a.test_date.localeCompare(b.test_date)),
        [attempts, today]
    );
    const past = useMemo(
        () => attempts
            .filter(a => {
                const d = new Date(a.test_date + 'T00:00:00');
                return d < today;
            })
            .sort((a, b) => b.test_date.localeCompare(a.test_date)),
        [attempts, today]
    );
    const nextTest = upcoming[0] ?? null;

    // Best score per test type, with most-recent goal_score for that type
    const bestByType = useMemo(() => {
        const map = new Map<TestType, { best: number; goal: number | null; attempts: number }>();
        attempts.forEach(a => {
            if (a.total_score == null) return;
            const cur = map.get(a.test_type);
            if (!cur || a.total_score > cur.best) {
                map.set(a.test_type, {
                    best: a.total_score,
                    goal: a.goal_score ?? cur?.goal ?? null,
                    attempts: (cur?.attempts ?? 0) + 1,
                });
            } else {
                map.set(a.test_type, { ...cur, attempts: cur.attempts + 1 });
            }
        });
        return map;
    }, [attempts]);

    const handleAdd = (input: TestAttemptInput) => {
        const tempId = `temp-${Date.now()}`;
        const optimistic: TestAttempt = {
            id: tempId,
            user_id: '',
            test_type: input.test_type,
            test_name: input.test_name?.trim() || null,
            test_date: input.test_date,
            registered: input.registered ?? false,
            total_score: input.total_score ?? null,
            breakdown: input.breakdown?.trim() || null,
            goal_score: input.goal_score ?? null,
            notes: input.notes?.trim() || null,
            created_at: new Date().toISOString(),
        };
        setAttempts(prev => [...prev, optimistic]);
        setShowAdd(false);

        runWithPending(async () => {
            try {
                const real = await addTestAttempt(input);
                if (real) setAttempts(prev => prev.map(a => a.id === tempId ? (real as TestAttempt) : a));
            } catch (err) {
                console.error("Add test attempt failed:", err);
                setAttempts(prev => prev.filter(a => a.id !== tempId));
            }
        });
    };

    const handleUpdate = (id: string, patch: Partial<TestAttemptInput>) => {
        const previous = attempts.find(a => a.id === id);
        if (!previous) return;

        const merged: TestAttempt = { ...previous };
        if (patch.test_type !== undefined) merged.test_type = patch.test_type;
        if (patch.test_name !== undefined) merged.test_name = patch.test_name?.trim() || null;
        if (patch.test_date !== undefined) merged.test_date = patch.test_date;
        if (patch.registered !== undefined) merged.registered = patch.registered;
        if (patch.total_score !== undefined) merged.total_score = patch.total_score;
        if (patch.breakdown !== undefined) merged.breakdown = patch.breakdown?.trim() || null;
        if (patch.goal_score !== undefined) merged.goal_score = patch.goal_score;
        if (patch.notes !== undefined) merged.notes = patch.notes?.trim() || null;
        setAttempts(prev => prev.map(a => a.id === id ? merged : a));

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await updateTestAttempt(id, patch);
            } catch (err) {
                console.error("Update test attempt failed:", err);
                setAttempts(prev => prev.map(a => a.id === id ? previous : a));
            }
        });
    };

    const handleDelete = (id: string) => {
        const previous = attempts;
        setAttempts(prev => prev.filter(a => a.id !== id));
        if (editingId === id) setEditingId(null);

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await deleteTestAttempt(id);
            } catch (err) {
                console.error("Delete test attempt failed:", err);
                setAttempts(previous);
            }
        });
    };

    const countdownLabel = (dateStr: string): string => {
        const d = new Date(dateStr + 'T00:00:00');
        if (isToday(d)) return 'TODAY';
        const days = differenceInDays(d, new Date());
        if (days === 1) return 'Tomorrow';
        return `${days} days`;
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        Test Prep
                    </h1>
                    <p className="text-muted-foreground">SAT, ACT, AP, and more — track scores and upcoming dates.</p>
                </div>
                <div className="flex items-center gap-2">
                    {pending > 0 && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Button onClick={() => setShowAdd(s => !s)} className="gap-2">
                        <Plus className="h-4 w-4" /> Log Attempt
                    </Button>
                </div>
            </div>

            {/* Hero / next test */}
            <Card className={cn(
                "glass-card border-none",
                nextTest
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white"
                    : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
            )}>
                <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-xs uppercase tracking-wider opacity-80 mb-1 flex items-center gap-1.5">
                                <CalendarClock className="h-3 w-3" /> Next Test
                            </div>
                            {nextTest ? (
                                <>
                                    <div className="text-2xl font-bold leading-tight">
                                        {nextTest.test_name || nextTest.test_type}
                                    </div>
                                    <div className="text-sm opacity-80 mt-0.5">
                                        {nextTest.test_type !== nextTest.test_name && nextTest.test_name && (
                                            <span>{nextTest.test_type} · </span>
                                        )}
                                        {format(new Date(nextTest.test_date + 'T00:00:00'), 'EEEE, MMM d, yyyy')}
                                    </div>
                                    {!nextTest.registered && (
                                        <div className="mt-2 inline-block bg-amber-400/30 text-xs font-bold px-2 py-1 rounded">
                                            Not registered yet
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-base opacity-80 py-2">
                                    No upcoming tests scheduled. Add one to start a countdown.
                                </div>
                            )}
                        </div>
                        {nextTest && (
                            <div className="text-right shrink-0">
                                <div className="text-4xl font-extrabold leading-none">
                                    {countdownLabel(nextTest.test_date)}
                                </div>
                                <div className="text-xs uppercase tracking-wider opacity-80 mt-1">until test day</div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Best scores grid */}
            {bestByType.size > 0 && (
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Trophy className="h-3 w-3" /> Best Scores
                    </h2>
                    <div className="grid gap-3 md:grid-cols-3">
                        {Array.from(bestByType.entries()).map(([type, info]) => {
                            const scoreMax = SCORE_MAX[type];
                            const goal = info.goal ?? scoreMax;
                            const progress = goal > 0 ? Math.min(100, (info.best / goal) * 100) : 0;
                            return (
                                <Card key={type} className="glass-card">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", TYPE_COLOR[type])}>
                                                {type}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {info.attempts} attempt{info.attempts === 1 ? '' : 's'}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-3xl font-bold">{info.best}</span>
                                            {info.goal != null && (
                                                <span className="text-sm text-muted-foreground">/ {info.goal} goal</span>
                                            )}
                                        </div>
                                        {info.goal != null && (
                                            <Progress value={progress} className="mt-2 h-1.5" />
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {showAdd && (
                <TestAttemptForm
                    onSubmit={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {attempts.length === 0 && !showAdd && (
                <Card className="glass-card">
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <BookCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No tests tracked yet.</p>
                        <p className="text-xs mt-1">Click &ldquo;Log Attempt&rdquo; to add a future test date or a past score.</p>
                    </CardContent>
                </Card>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <CalendarClock className="h-3 w-3" /> Upcoming <span className="opacity-60">({upcoming.length})</span>
                    </h2>
                    <div className="space-y-2">
                        {upcoming.map(a => (
                            <AttemptCard
                                key={a.id}
                                attempt={a}
                                isUpcoming
                                isEditing={editingId === a.id}
                                onEdit={() => setEditingId(a.id)}
                                onCancelEdit={() => setEditingId(null)}
                                onUpdate={(patch) => { handleUpdate(a.id, patch); setEditingId(null); }}
                                onToggleRegistered={() => handleUpdate(a.id, { registered: !a.registered })}
                                onDelete={() => handleDelete(a.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past */}
            {past.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="h-3 w-3" /> Past Attempts <span className="opacity-60">({past.length})</span>
                    </h2>
                    <div className="space-y-2">
                        {past.map(a => (
                            <AttemptCard
                                key={a.id}
                                attempt={a}
                                isUpcoming={false}
                                isEditing={editingId === a.id}
                                onEdit={() => setEditingId(a.id)}
                                onCancelEdit={() => setEditingId(null)}
                                onUpdate={(patch) => { handleUpdate(a.id, patch); setEditingId(null); }}
                                onToggleRegistered={() => handleUpdate(a.id, { registered: !a.registered })}
                                onDelete={() => handleDelete(a.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AttemptCard({
    attempt, isUpcoming, isEditing, onEdit, onCancelEdit, onUpdate, onToggleRegistered, onDelete,
}: {
    attempt: TestAttempt;
    isUpcoming: boolean;
    isEditing: boolean;
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (patch: Partial<TestAttemptInput>) => void;
    onToggleRegistered: () => void;
    onDelete: () => void;
}) {
    if (isEditing) {
        return (
            <TestAttemptForm
                initial={attempt}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
            />
        );
    }

    const dateStr = format(new Date(attempt.test_date + 'T00:00:00'), 'MMM d, yyyy');
    const hasScore = attempt.total_score != null;
    const hitGoal = hasScore && attempt.goal_score != null && attempt.total_score! >= attempt.goal_score;

    return (
        <Card className="glass-card group transition-all hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="font-semibold leading-tight">
                                {attempt.test_name || attempt.test_type}
                            </h3>
                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", TYPE_COLOR[attempt.test_type])}>
                                {attempt.test_type}
                            </span>
                            {isUpcoming && attempt.registered && (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                    Registered
                                </span>
                            )}
                            {hitGoal && (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                    Goal hit
                                </span>
                            )}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                            <span>{dateStr}</span>
                            {!hasScore && !isUpcoming && (
                                <span className="text-amber-600 font-semibold">Score not recorded</span>
                            )}
                            {hasScore && (
                                <span className="font-semibold text-foreground text-base">
                                    {attempt.total_score}
                                    {attempt.goal_score != null && (
                                        <span className="text-muted-foreground text-xs font-normal">
                                            {' '}/ {attempt.goal_score} goal
                                        </span>
                                    )}
                                </span>
                            )}
                            {attempt.breakdown && (
                                <span className="text-xs italic">{attempt.breakdown}</span>
                            )}
                        </div>

                        {attempt.notes && (
                            <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                {attempt.notes}
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-1 shrink-0">
                        {isUpcoming && !attempt.registered && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onToggleRegistered}
                                className="h-7 text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            >
                                <Target className="h-3 w-3" /> Mark registered
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEdit}
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TestAttemptForm({
    initial, onSubmit, onCancel,
}: {
    initial?: TestAttempt;
    onSubmit: (input: TestAttemptInput) => void;
    onCancel: () => void;
}) {
    const [testType, setTestType] = useState<TestType>(initial?.test_type ?? 'SAT');
    const [testName, setTestName] = useState(initial?.test_name ?? '');
    const [testDate, setTestDate] = useState(initial?.test_date ?? '');
    const [registered, setRegistered] = useState(initial?.registered ?? false);
    const [totalScore, setTotalScore] = useState<string>(
        initial?.total_score != null ? String(initial.total_score) : ''
    );
    const [breakdown, setBreakdown] = useState(initial?.breakdown ?? '');
    const [goalScore, setGoalScore] = useState<string>(
        initial?.goal_score != null ? String(initial.goal_score) : ''
    );
    const [notes, setNotes] = useState(initial?.notes ?? '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!testDate) return;

        const total = totalScore.trim() === '' ? null : parseInt(totalScore);
        const goal = goalScore.trim() === '' ? null : parseInt(goalScore);

        onSubmit({
            test_type: testType,
            test_name: testName.trim() || null,
            test_date: testDate,
            registered,
            total_score: total != null && !isNaN(total) ? total : null,
            breakdown: breakdown.trim() || null,
            goal_score: goal != null && !isNaN(goal) ? goal : null,
            notes: notes.trim() || null,
        });
    };

    const showSubjectName = testType === 'AP' || testType === 'Subject Test' || testType === 'Other';
    const scoreHint = SCORE_MAX[testType] === 1600 ? 'e.g. 1480 (out of 1600)'
        : SCORE_MAX[testType] === 36 ? 'e.g. 32 (out of 36)'
            : SCORE_MAX[testType] === 5 ? 'e.g. 5 (out of 5)'
                : SCORE_MAX[testType] === 800 ? 'e.g. 720 (out of 800)'
                    : 'Total score';

    return (
        <Card className="glass-card border-primary/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <BookCheck className="h-4 w-4 text-primary" />
                    {initial ? 'Edit attempt' : 'New test attempt'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Test type *</label>
                            <Select value={testType} onValueChange={(v) => setTestType(v as TestType)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SAT">SAT</SelectItem>
                                    <SelectItem value="ACT">ACT</SelectItem>
                                    <SelectItem value="PSAT">PSAT</SelectItem>
                                    <SelectItem value="AP">AP</SelectItem>
                                    <SelectItem value="Subject Test">Subject Test</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Test date *</label>
                            <Input
                                type="date"
                                value={testDate}
                                onChange={(e) => setTestDate(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>
                        {showSubjectName && (
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-muted-foreground">
                                    Subject / name
                                </label>
                                <Input
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                    placeholder={
                                        testType === 'AP' ? 'e.g. AP Calculus BC' :
                                            testType === 'Subject Test' ? 'e.g. Biology E' :
                                                'e.g. CLT'
                                    }
                                    className="mt-1"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">
                                Total score
                            </label>
                            <Input
                                type="number"
                                min="0"
                                max="2400"
                                value={totalScore}
                                onChange={(e) => setTotalScore(e.target.value)}
                                placeholder={scoreHint}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Goal score</label>
                            <Input
                                type="number"
                                min="0"
                                max="2400"
                                value={goalScore}
                                onChange={(e) => setGoalScore(e.target.value)}
                                placeholder="What you're shooting for"
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">
                                Subscores / breakdown
                            </label>
                            <Input
                                value={breakdown}
                                onChange={(e) => setBreakdown(e.target.value)}
                                placeholder='e.g. "Math 720, EBRW 760" or "English 33, Math 30, Reading 34, Science 32"'
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2">
                            <Checkbox
                                id="registered"
                                checked={registered}
                                onCheckedChange={(v) => setRegistered(v === true)}
                            />
                            <label htmlFor="registered" className="text-sm cursor-pointer">
                                I'm registered for this test
                            </label>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Prep plan, materials used, weak areas, follow-up..."
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">{initial ? 'Save changes' : 'Add attempt'}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
