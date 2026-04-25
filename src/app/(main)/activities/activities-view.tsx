
"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Plus, X, Trophy, Clock, Building2, Loader2, Pencil, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Activity, ActivityCategory } from "@/types/database";
import {
    addActivity, updateActivity, deleteActivity, ActivityInput,
} from "./actions";

const CATEGORY_ORDER: ActivityCategory[] = [
    'Leadership / Government',
    'Academic',
    'Research / Science',
    'Athletics',
    'Arts',
    'Community Service',
    'Work / Internship',
    'Religious / Cultural',
    'Other',
];

const CATEGORY_COLOR: Record<ActivityCategory, string> = {
    'Academic': 'bg-blue-100 text-blue-700',
    'Athletics': 'bg-orange-100 text-orange-700',
    'Arts': 'bg-violet-100 text-violet-700',
    'Community Service': 'bg-emerald-100 text-emerald-700',
    'Leadership / Government': 'bg-primary/10 text-primary',
    'Work / Internship': 'bg-amber-100 text-amber-700',
    'Religious / Cultural': 'bg-rose-100 text-rose-700',
    'Research / Science': 'bg-teal-100 text-teal-700',
    'Other': 'bg-muted text-muted-foreground',
};

const ALL_GRADES: (9 | 10 | 11 | 12)[] = [9, 10, 11, 12];

export function ActivitiesView({ initialActivities }: { initialActivities: Activity[] }) {
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
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

    const grouped = useMemo(() => {
        const map = new Map<ActivityCategory, Activity[]>();
        CATEGORY_ORDER.forEach(c => map.set(c, []));
        activities.forEach(a => map.get(a.category)?.push(a));
        return map;
    }, [activities]);

    const totalHours = activities.reduce((sum, a) => sum + (a.hours_per_week ?? 0), 0);
    const collegeContinuers = activities.filter(a => a.continue_in_college).length;

    const handleAdd = (input: ActivityInput) => {
        const tempId = `temp-${Date.now()}`;
        const optimistic: Activity = {
            id: tempId,
            user_id: '',
            name: input.name,
            organization: input.organization?.trim() || null,
            role: input.role?.trim() || null,
            category: input.category,
            description: input.description?.trim() || null,
            hours_per_week: input.hours_per_week ?? null,
            weeks_per_year: input.weeks_per_year ?? null,
            grade_levels: (input.grade_levels ?? []) as (9 | 10 | 11 | 12)[],
            continue_in_college: input.continue_in_college ?? false,
            created_at: new Date().toISOString(),
        };
        setActivities(prev => [...prev, optimistic]);
        setShowAdd(false);

        runWithPending(async () => {
            try {
                const real = await addActivity(input);
                if (real) setActivities(prev => prev.map(a => a.id === tempId ? (real as Activity) : a));
            } catch (err) {
                console.error("Add activity failed:", err);
                setActivities(prev => prev.filter(a => a.id !== tempId));
            }
        });
    };

    const handleUpdate = (id: string, patch: Partial<ActivityInput>) => {
        const previous = activities.find(a => a.id === id);
        if (!previous) return;

        const merged: Activity = { ...previous };
        if (patch.name !== undefined) merged.name = patch.name;
        if (patch.organization !== undefined) merged.organization = patch.organization?.trim() || null;
        if (patch.role !== undefined) merged.role = patch.role?.trim() || null;
        if (patch.category !== undefined) merged.category = patch.category;
        if (patch.description !== undefined) merged.description = patch.description?.trim() || null;
        if (patch.hours_per_week !== undefined) merged.hours_per_week = patch.hours_per_week;
        if (patch.weeks_per_year !== undefined) merged.weeks_per_year = patch.weeks_per_year;
        if (patch.grade_levels !== undefined) merged.grade_levels = patch.grade_levels as (9 | 10 | 11 | 12)[];
        if (patch.continue_in_college !== undefined) merged.continue_in_college = patch.continue_in_college;
        setActivities(prev => prev.map(a => a.id === id ? merged : a));

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await updateActivity(id, patch);
            } catch (err) {
                console.error("Update activity failed:", err);
                setActivities(prev => prev.map(a => a.id === id ? previous : a));
            }
        });
    };

    const handleDelete = (id: string) => {
        const previous = activities;
        setActivities(prev => prev.filter(a => a.id !== id));
        if (editingId === id) setEditingId(null);

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await deleteActivity(id);
            } catch (err) {
                console.error("Delete activity failed:", err);
                setActivities(previous);
            }
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        Activities
                    </h1>
                    <p className="text-muted-foreground">Extracurriculars to list on your Common App.</p>
                </div>
                <div className="flex items-center gap-2">
                    {pending > 0 && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Button onClick={() => setShowAdd(s => !s)} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Activity
                    </Button>
                </div>
            </div>

            {/* Summary */}
            <Card className="glass-card">
                <CardContent className="p-5">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border-l-4 border-l-primary pl-4">
                            <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Trophy className="h-3 w-3" /> Total Activities
                            </div>
                            <div className="text-3xl font-bold">{activities.length}</div>
                            <div className="text-xs text-muted-foreground">
                                Common App allows up to 10
                            </div>
                        </div>
                        <div className="border-l-4 border-l-gold pl-4">
                            <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> Hours / Week
                            </div>
                            <div className="text-3xl font-bold">{totalHours.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">
                                Across all activities
                            </div>
                        </div>
                        <div className="border-l-4 border-l-emerald-500 pl-4">
                            <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
                                <GraduationCap className="h-3 w-3" /> Continuing
                            </div>
                            <div className="text-3xl font-bold">{collegeContinuers}</div>
                            <div className="text-xs text-muted-foreground">
                                Marked &ldquo;continue in college&rdquo;
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showAdd && (
                <ActivityForm
                    onSubmit={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {activities.length === 0 && !showAdd && (
                <Card className="glass-card">
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <Trophy className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No activities tracked yet.</p>
                        <p className="text-xs mt-1">Click &ldquo;Add Activity&rdquo; to start logging your extracurriculars.</p>
                    </CardContent>
                </Card>
            )}

            {/* Grouped activities */}
            {CATEGORY_ORDER.map(category => {
                const list = grouped.get(category) ?? [];
                if (list.length === 0) return null;
                return (
                    <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            <span className={cn("inline-block w-2 h-2 rounded-full",
                                category === 'Leadership / Government' ? 'bg-primary' :
                                    category === 'Academic' ? 'bg-blue-500' :
                                        category === 'Athletics' ? 'bg-orange-500' :
                                            category === 'Arts' ? 'bg-violet-500' :
                                                category === 'Community Service' ? 'bg-emerald-500' :
                                                    category === 'Research / Science' ? 'bg-teal-500' :
                                                        category === 'Work / Internship' ? 'bg-amber-500' :
                                                            category === 'Religious / Cultural' ? 'bg-rose-500' :
                                                                'bg-slate-400'
                            )} />
                            {category} <span className="text-xs opacity-60">({list.length})</span>
                        </div>
                        <div className="space-y-2">
                            {list.map(activity => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    isEditing={editingId === activity.id}
                                    onEdit={() => setEditingId(activity.id)}
                                    onCancelEdit={() => setEditingId(null)}
                                    onUpdate={(patch) => {
                                        handleUpdate(activity.id, patch);
                                        setEditingId(null);
                                    }}
                                    onDelete={() => handleDelete(activity.id)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ActivityCard({
    activity, isEditing, onEdit, onCancelEdit, onUpdate, onDelete,
}: {
    activity: Activity;
    isEditing: boolean;
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (patch: Partial<ActivityInput>) => void;
    onDelete: () => void;
}) {
    if (isEditing) {
        return (
            <ActivityForm
                initial={activity}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
            />
        );
    }

    const grades = [...activity.grade_levels].sort((a, b) => a - b);

    return (
        <Card className="glass-card group transition-all hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="font-semibold leading-tight">{activity.name}</h3>
                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", CATEGORY_COLOR[activity.category])}>
                                {activity.category}
                            </span>
                            {activity.continue_in_college && (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                    Continue in college
                                </span>
                            )}
                        </div>

                        {(activity.role || activity.organization) && (
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                                {activity.role && <span className="font-medium text-foreground">{activity.role}</span>}
                                {activity.role && activity.organization && <span>·</span>}
                                {activity.organization && (
                                    <span className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3" /> {activity.organization}
                                    </span>
                                )}
                            </div>
                        )}

                        {activity.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {activity.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                            {grades.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] uppercase font-semibold opacity-70">Grades:</span>
                                    <div className="flex gap-0.5">
                                        {grades.map(g => (
                                            <span key={g} className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activity.hours_per_week != null && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {activity.hours_per_week} hrs/wk
                                </span>
                            )}
                            {activity.weeks_per_year != null && (
                                <span>{activity.weeks_per_year} wks/yr</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-1 shrink-0">
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

function ActivityForm({
    initial, onSubmit, onCancel,
}: {
    initial?: Activity;
    onSubmit: (input: ActivityInput) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(initial?.name ?? '');
    const [organization, setOrganization] = useState(initial?.organization ?? '');
    const [role, setRole] = useState(initial?.role ?? '');
    const [category, setCategory] = useState<ActivityCategory>(initial?.category ?? 'Academic');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [hoursPerWeek, setHoursPerWeek] = useState<string>(
        initial?.hours_per_week != null ? String(initial.hours_per_week) : ''
    );
    const [weeksPerYear, setWeeksPerYear] = useState<string>(
        initial?.weeks_per_year != null ? String(initial.weeks_per_year) : ''
    );
    const [gradeLevels, setGradeLevels] = useState<(9 | 10 | 11 | 12)[]>(
        initial?.grade_levels ?? []
    );
    const [continueInCollege, setContinueInCollege] = useState(initial?.continue_in_college ?? false);

    const toggleGrade = (g: 9 | 10 | 11 | 12) => {
        setGradeLevels(prev =>
            prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g].sort((a, b) => a - b)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const hpw = hoursPerWeek.trim() === '' ? null : parseFloat(hoursPerWeek);
        const wpy = weeksPerYear.trim() === '' ? null : parseInt(weeksPerYear);
        const input: ActivityInput = {
            name: name.trim(),
            organization: organization.trim() || null,
            role: role.trim() || null,
            category,
            description: description.trim() || null,
            hours_per_week: hpw != null && !isNaN(hpw) ? hpw : null,
            weeks_per_year: wpy != null && !isNaN(wpy) ? wpy : null,
            grade_levels: gradeLevels,
            continue_in_college: continueInCollege,
        };
        onSubmit(input);
    };

    return (
        <Card className="glass-card border-primary/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    {initial ? 'Edit activity' : 'New activity'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Activity name *</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Varsity Soccer"
                                required
                                autoFocus
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Organization</label>
                            <Input
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                placeholder="e.g. School Name / Boys & Girls Club"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Position / Role</label>
                            <Input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Captain, Member, President"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Category</label>
                            <Select value={category} onValueChange={(v) => setCategory(v as ActivityCategory)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORY_ORDER.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Hours / week</label>
                            <Input
                                type="number"
                                min="0"
                                max="168"
                                step="0.5"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(e.target.value)}
                                placeholder="e.g. 6"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Weeks / year</label>
                            <Input
                                type="number"
                                min="0"
                                max="52"
                                value={weeksPerYear}
                                onChange={(e) => setWeeksPerYear(e.target.value)}
                                placeholder="e.g. 30"
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Grade levels</label>
                            <div className="flex gap-2 mt-1">
                                {ALL_GRADES.map(g => {
                                    const selected = gradeLevels.includes(g);
                                    return (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => toggleGrade(g)}
                                            className={cn(
                                                "h-9 w-12 rounded-lg text-sm font-bold border transition-colors",
                                                selected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-white/50 text-muted-foreground border-input hover:border-primary/50"
                                            )}
                                        >
                                            {g}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly describe what you did. Common App allows ~150 characters."
                                rows={2}
                                className="mt-1"
                            />
                            <div className="text-[10px] text-muted-foreground text-right mt-0.5">
                                {description.length} chars
                            </div>
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2">
                            <Checkbox
                                id="continue-college"
                                checked={continueInCollege}
                                onCheckedChange={(v) => setContinueInCollege(v === true)}
                            />
                            <label htmlFor="continue-college" className="text-sm cursor-pointer">
                                I plan to continue this in college
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">{initial ? 'Save changes' : 'Add activity'}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
