
"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Plus, X, FileText, CalendarClock, GraduationCap, Loader2, ChevronDown, ChevronRight, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast, isToday } from "date-fns";
import { Essay, EssayStatus, EssayType } from "@/types/database";
import { addEssay, updateEssay, deleteEssay, EssayInput } from "./actions";

const STATUS_ORDER: EssayStatus[] = ['Drafting', 'Reviewing', 'Not Started', 'Submitted'];
const STATUS_COLOR: Record<EssayStatus, string> = {
    'Not Started': 'bg-slate-100 text-slate-600',
    'Drafting': 'bg-amber-100 text-amber-700',
    'Reviewing': 'bg-blue-100 text-blue-700',
    'Submitted': 'bg-emerald-100 text-emerald-700',
};
const TYPE_COLOR: Record<EssayType, string> = {
    'Common App': 'bg-primary/10 text-primary',
    'Supplemental': 'bg-violet-100 text-violet-700',
    'Scholarship': 'bg-gold/20 text-amber-800',
    'Other': 'bg-muted text-muted-foreground',
};

function deadlineLabel(date: string | null): { label: string; tone: 'past' | 'soon' | 'ok' | 'none' } {
    if (!date) return { label: 'No deadline', tone: 'none' };
    const d = new Date(date + 'T00:00:00');
    if (isToday(d)) return { label: 'Due today', tone: 'soon' };
    if (isPast(d)) return { label: `Past due (${format(d, 'MMM d')})`, tone: 'past' };
    const days = differenceInDays(d, new Date());
    if (days <= 7) return { label: `In ${days} day${days === 1 ? '' : 's'}`, tone: 'soon' };
    if (days <= 30) return { label: `In ${days} days`, tone: 'ok' };
    return { label: format(d, 'MMM d, yyyy'), tone: 'ok' };
}

interface EssaysViewProps {
    initialEssays: Essay[];
    schoolSuggestions: string[];
}

export function EssaysView({ initialEssays, schoolSuggestions }: EssaysViewProps) {
    const [essays, setEssays] = useState<Essay[]>(initialEssays);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showSubmitted, setShowSubmitted] = useState(false);
    const [, startTransition] = useTransition();
    const [pending, setPending] = useState(0);

    const runWithPending = (fn: () => Promise<void>) => {
        setPending(p => p + 1);
        startTransition(async () => {
            try { await fn(); } finally { setPending(p => p - 1); }
        });
    };

    const grouped = useMemo(() => {
        const map: Record<EssayStatus, Essay[]> = {
            'Not Started': [], 'Drafting': [], 'Reviewing': [], 'Submitted': [],
        };
        essays.forEach(e => map[e.status].push(e));
        return map;
    }, [essays]);

    const nextDeadline = useMemo(() => {
        return essays
            .filter(e => e.status !== 'Submitted' && e.deadline)
            .sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''))[0] ?? null;
    }, [essays]);

    const counts = {
        active: grouped['Not Started'].length + grouped['Drafting'].length + grouped['Reviewing'].length,
        submitted: grouped['Submitted'].length,
        total: essays.length,
    };

    const handleAdd = (input: EssayInput) => {
        const tempId = `temp-${Date.now()}`;
        const optimistic: Essay = {
            id: tempId,
            user_id: '',
            title: input.title,
            school: input.school?.trim() || null,
            type: input.type,
            prompt: input.prompt?.trim() || null,
            word_limit: input.word_limit ?? null,
            status: input.status ?? 'Not Started',
            deadline: input.deadline || null,
            notes: input.notes?.trim() || null,
            created_at: new Date().toISOString(),
        };
        setEssays(prev => [...prev, optimistic]);
        setShowAdd(false);

        runWithPending(async () => {
            try {
                const real = await addEssay(input);
                if (real) setEssays(prev => prev.map(e => e.id === tempId ? (real as Essay) : e));
            } catch (err) {
                console.error("Add essay failed:", err);
                setEssays(prev => prev.filter(e => e.id !== tempId));
            }
        });
    };

    const handleUpdate = (id: string, patch: Partial<EssayInput>) => {
        const previous = essays.find(e => e.id === id);
        if (!previous) return;

        const merged: Essay = { ...previous };
        if (patch.title !== undefined) merged.title = patch.title;
        if (patch.school !== undefined) merged.school = patch.school?.trim() || null;
        if (patch.type !== undefined) merged.type = patch.type;
        if (patch.prompt !== undefined) merged.prompt = patch.prompt?.trim() || null;
        if (patch.word_limit !== undefined) merged.word_limit = patch.word_limit;
        if (patch.status !== undefined) merged.status = patch.status;
        if (patch.deadline !== undefined) merged.deadline = patch.deadline || null;
        if (patch.notes !== undefined) merged.notes = patch.notes?.trim() || null;
        setEssays(prev => prev.map(e => e.id === id ? merged : e));

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await updateEssay(id, patch);
            } catch (err) {
                console.error("Update essay failed:", err);
                setEssays(prev => prev.map(e => e.id === id ? previous : e));
            }
        });
    };

    const handleDelete = (id: string) => {
        const previous = essays;
        setEssays(prev => prev.filter(e => e.id !== id));
        if (editingId === id) setEditingId(null);

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await deleteEssay(id);
            } catch (err) {
                console.error("Delete essay failed:", err);
                setEssays(previous);
            }
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        College Essays
                    </h1>
                    <p className="text-muted-foreground">Track applications, prompts, and deadlines.</p>
                </div>
                <div className="flex items-center gap-2">
                    {pending > 0 && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Button onClick={() => setShowAdd(s => !s)} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Essay
                    </Button>
                </div>
            </div>

            {/* Hero / next deadline */}
            <Card className={cn(
                "glass-card border-none",
                nextDeadline
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white"
                    : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
            )}>
                <CardContent className="p-5">
                    <div className="grid gap-4 md:grid-cols-3 items-center">
                        <div className="md:col-span-2">
                            <div className="text-xs uppercase tracking-wider opacity-80 mb-1 flex items-center gap-1.5">
                                <CalendarClock className="h-3 w-3" /> Next Deadline
                            </div>
                            {nextDeadline ? (
                                <>
                                    <div className="text-2xl font-bold">{nextDeadline.title}</div>
                                    <div className="text-sm opacity-80">
                                        {nextDeadline.school ? `${nextDeadline.school} · ` : ''}{nextDeadline.type}
                                    </div>
                                </>
                            ) : (
                                <div className="text-lg opacity-80">
                                    {essays.length === 0
                                        ? "No essays yet. Add your first one!"
                                        : "No upcoming deadlines."}
                                </div>
                            )}
                        </div>
                        <div className="flex md:justify-end gap-2 text-sm">
                            <div className="bg-white/15 px-3 py-2 rounded-lg backdrop-blur-md">
                                <div className="text-[10px] uppercase opacity-70">Active</div>
                                <div className="text-lg font-bold">{counts.active}</div>
                            </div>
                            <div className="bg-white/15 px-3 py-2 rounded-lg backdrop-blur-md">
                                <div className="text-[10px] uppercase opacity-70">Submitted</div>
                                <div className="text-lg font-bold">{counts.submitted}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add form */}
            {showAdd && (
                <EssayForm
                    schoolSuggestions={schoolSuggestions}
                    onSubmit={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {/* Empty state */}
            {essays.length === 0 && !showAdd && (
                <Card className="glass-card">
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No college essays tracked yet.</p>
                        <p className="text-xs mt-1">Click &ldquo;Add Essay&rdquo; to start tracking your application essays.</p>
                    </CardContent>
                </Card>
            )}

            {/* Essay groups */}
            {STATUS_ORDER.map(status => {
                const list = grouped[status];
                if (list.length === 0) return null;
                if (status === 'Submitted') return null; // rendered separately below

                return (
                    <div key={status} className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            <span className={cn("inline-block w-2 h-2 rounded-full",
                                status === 'Drafting' ? 'bg-amber-500' :
                                    status === 'Reviewing' ? 'bg-blue-500' : 'bg-slate-400'
                            )} />
                            {status} <span className="text-xs opacity-60">({list.length})</span>
                        </div>
                        <div className="space-y-2">
                            {list.map(essay => (
                                <EssayCard
                                    key={essay.id}
                                    essay={essay}
                                    isEditing={editingId === essay.id}
                                    schoolSuggestions={schoolSuggestions}
                                    onEdit={() => setEditingId(essay.id)}
                                    onCancelEdit={() => setEditingId(null)}
                                    onUpdate={(patch) => {
                                        handleUpdate(essay.id, patch);
                                        setEditingId(null);
                                    }}
                                    onQuickStatus={(s) => handleUpdate(essay.id, { status: s })}
                                    onDelete={() => handleDelete(essay.id)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Submitted (collapsible) */}
            {grouped['Submitted'].length > 0 && (
                <div className="space-y-3">
                    <button
                        onClick={() => setShowSubmitted(s => !s)}
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                        {showSubmitted ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                        Submitted <span className="text-xs opacity-60">({grouped['Submitted'].length})</span>
                    </button>
                    {showSubmitted && (
                        <div className="space-y-2">
                            {grouped['Submitted'].map(essay => (
                                <EssayCard
                                    key={essay.id}
                                    essay={essay}
                                    isEditing={editingId === essay.id}
                                    schoolSuggestions={schoolSuggestions}
                                    onEdit={() => setEditingId(essay.id)}
                                    onCancelEdit={() => setEditingId(null)}
                                    onUpdate={(patch) => {
                                        handleUpdate(essay.id, patch);
                                        setEditingId(null);
                                    }}
                                    onQuickStatus={(s) => handleUpdate(essay.id, { status: s })}
                                    onDelete={() => handleDelete(essay.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function EssayCard({
    essay, isEditing, schoolSuggestions, onEdit, onCancelEdit, onUpdate, onQuickStatus, onDelete,
}: {
    essay: Essay;
    isEditing: boolean;
    schoolSuggestions: string[];
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (patch: Partial<EssayInput>) => void;
    onQuickStatus: (s: EssayStatus) => void;
    onDelete: () => void;
}) {
    if (isEditing) {
        return (
            <EssayForm
                initial={essay}
                schoolSuggestions={schoolSuggestions}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
            />
        );
    }

    const dl = deadlineLabel(essay.deadline);
    const submitted = essay.status === 'Submitted';

    return (
        <Card className={cn(
            "glass-card group transition-all hover:shadow-md",
            submitted && "opacity-60"
        )}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2 flex-wrap">
                            <h3 className={cn("font-semibold leading-tight", submitted && "line-through")}>
                                {essay.title}
                            </h3>
                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", TYPE_COLOR[essay.type])}>
                                {essay.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 flex-wrap">
                            {essay.school && (
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" /> {essay.school}
                                </span>
                            )}
                            <span className={cn(
                                "flex items-center gap-1",
                                dl.tone === 'past' && "text-red-600 font-semibold",
                                dl.tone === 'soon' && "text-amber-600 font-semibold",
                            )}>
                                <CalendarClock className="h-3 w-3" /> {dl.label}
                            </span>
                            {essay.word_limit && (
                                <span>{essay.word_limit} word limit</span>
                            )}
                        </div>
                        {essay.prompt && (
                            <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                                &ldquo;{essay.prompt}&rdquo;
                            </p>
                        )}
                    </div>
                    <div className="flex items-start gap-1 shrink-0">
                        <Select value={essay.status} onValueChange={(v) => onQuickStatus(v as EssayStatus)}>
                            <SelectTrigger className={cn("h-7 text-xs font-semibold border-none w-[110px]", STATUS_COLOR[essay.status])}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                                <SelectItem value="Drafting">Drafting</SelectItem>
                                <SelectItem value="Reviewing">Reviewing</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                            </SelectContent>
                        </Select>
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
                {essay.notes && (
                    <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground whitespace-pre-wrap">
                        {essay.notes}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function EssayForm({
    initial, schoolSuggestions, onSubmit, onCancel,
}: {
    initial?: Essay;
    schoolSuggestions: string[];
    onSubmit: (input: EssayInput) => void;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState(initial?.title ?? '');
    const [school, setSchool] = useState(initial?.school ?? '');
    const [type, setType] = useState<EssayType>(initial?.type ?? 'Supplemental');
    const [prompt, setPrompt] = useState(initial?.prompt ?? '');
    const [wordLimit, setWordLimit] = useState<string>(
        initial?.word_limit != null ? String(initial.word_limit) : ''
    );
    const [status, setStatus] = useState<EssayStatus>(initial?.status ?? 'Not Started');
    const [deadline, setDeadline] = useState(initial?.deadline ?? '');
    const [notes, setNotes] = useState(initial?.notes ?? '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const wl = wordLimit.trim() === '' ? null : parseInt(wordLimit);
        const input: EssayInput = {
            title: title.trim(),
            school: school.trim() || null,
            type,
            prompt: prompt.trim() || null,
            word_limit: wl != null && !isNaN(wl) ? wl : null,
            status,
            deadline: deadline || null,
            notes: notes.trim() || null,
        };
        onSubmit(input);
    };

    return (
        <Card className="glass-card border-primary/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {initial ? 'Edit essay' : 'New essay'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Title *</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Why Stanford? supplement"
                                required
                                autoFocus
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">School</label>
                            <Input
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                placeholder="e.g. Stanford"
                                list={schoolSuggestions.length > 0 ? "school-suggestions" : undefined}
                                className="mt-1"
                            />
                            {schoolSuggestions.length > 0 && (
                                <datalist id="school-suggestions">
                                    {schoolSuggestions.map(s => <option key={s} value={s} />)}
                                </datalist>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Type</label>
                            <Select value={type} onValueChange={(v) => setType(v as EssayType)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Common App">Common App</SelectItem>
                                    <SelectItem value="Supplemental">Supplemental</SelectItem>
                                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Status</label>
                            <Select value={status} onValueChange={(v) => setStatus(v as EssayStatus)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Not Started">Not Started</SelectItem>
                                    <SelectItem value="Drafting">Drafting</SelectItem>
                                    <SelectItem value="Reviewing">Reviewing</SelectItem>
                                    <SelectItem value="Submitted">Submitted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Deadline</label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Word limit</label>
                            <Input
                                type="number"
                                min="1"
                                max="100000"
                                value={wordLimit}
                                onChange={(e) => setWordLimit(e.target.value)}
                                placeholder="e.g. 650"
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Prompt</label>
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="The essay question, if any..."
                                rows={2}
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Brainstorm ideas, links to drafts in Google Docs, etc."
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">{initial ? 'Save changes' : 'Add essay'}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
