
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
    Plus, X, Mail, Pencil, ChevronDown, ChevronRight, Loader2, CalendarClock, MessageSquareQuote, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast, isToday } from "date-fns";
import { Recommendation, RecStatus, RecommenderType } from "@/types/database";
import {
    addRecommendation, updateRecommendation, deleteRecommendation, RecommendationInput,
} from "./actions";

const STATUS_ORDER: RecStatus[] = ['Asked', 'Confirmed', 'Not Asked', 'Submitted', 'Declined'];
const STATUS_COLOR: Record<RecStatus, string> = {
    'Not Asked': 'bg-slate-100 text-slate-600',
    'Asked': 'bg-amber-100 text-amber-700',
    'Confirmed': 'bg-blue-100 text-blue-700',
    'Submitted': 'bg-emerald-100 text-emerald-700',
    'Declined': 'bg-red-100 text-red-700',
};
const TYPE_COLOR: Record<RecommenderType, string> = {
    'Teacher': 'bg-primary/10 text-primary',
    'Counselor': 'bg-violet-100 text-violet-700',
    'Coach': 'bg-orange-100 text-orange-700',
    'Employer': 'bg-amber-100 text-amber-700',
    'Other': 'bg-muted text-muted-foreground',
};

function deadlineLabel(date: string | null): { label: string; tone: 'past' | 'soon' | 'ok' | 'none' } {
    if (!date) return { label: 'No deadline', tone: 'none' };
    const d = new Date(date + 'T00:00:00');
    if (isToday(d)) return { label: 'Due today', tone: 'soon' };
    if (isPast(d)) return { label: `Past due (${format(d, 'MMM d')})`, tone: 'past' };
    const days = differenceInDays(d, new Date());
    if (days <= 14) return { label: `In ${days} day${days === 1 ? '' : 's'}`, tone: 'soon' };
    if (days <= 60) return { label: `In ${days} days`, tone: 'ok' };
    return { label: format(d, 'MMM d, yyyy'), tone: 'ok' };
}

export function RecommendationsView({ initialRecs }: { initialRecs: Recommendation[] }) {
    const [recs, setRecs] = useState<Recommendation[]>(initialRecs);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showArchive, setShowArchive] = useState(false);
    const [, startTransition] = useTransition();
    const [pending, setPending] = useState(0);

    const runWithPending = (fn: () => Promise<void>) => {
        setPending(p => p + 1);
        startTransition(async () => {
            try { await fn(); } finally { setPending(p => p - 1); }
        });
    };

    const grouped = useMemo(() => {
        const map: Record<RecStatus, Recommendation[]> = {
            'Not Asked': [], 'Asked': [], 'Confirmed': [], 'Submitted': [], 'Declined': [],
        };
        recs.forEach(r => map[r.status].push(r));
        return map;
    }, [recs]);

    const counts = {
        active: grouped['Asked'].length + grouped['Confirmed'].length,
        notAsked: grouped['Not Asked'].length,
        done: grouped['Submitted'].length,
        declined: grouped['Declined'].length,
    };

    const nextDeadline = useMemo(() => {
        return recs
            .filter(r => r.status !== 'Submitted' && r.status !== 'Declined' && r.deadline)
            .sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''))[0] ?? null;
    }, [recs]);

    const handleAdd = (input: RecommendationInput) => {
        const tempId = `temp-${Date.now()}`;
        const optimistic: Recommendation = {
            id: tempId,
            user_id: '',
            recommender_name: input.recommender_name,
            recommender_role: input.recommender_role?.trim() || null,
            email: input.email?.trim() || null,
            type: input.type,
            status: input.status ?? 'Not Asked',
            requested_date: input.requested_date || null,
            deadline: input.deadline || null,
            notes: input.notes?.trim() || null,
            created_at: new Date().toISOString(),
        };
        setRecs(prev => [...prev, optimistic]);
        setShowAdd(false);

        runWithPending(async () => {
            try {
                const real = await addRecommendation(input);
                if (real) setRecs(prev => prev.map(r => r.id === tempId ? (real as Recommendation) : r));
            } catch (err) {
                console.error("Add recommendation failed:", err);
                setRecs(prev => prev.filter(r => r.id !== tempId));
            }
        });
    };

    const handleUpdate = (id: string, patch: Partial<RecommendationInput>) => {
        const previous = recs.find(r => r.id === id);
        if (!previous) return;

        const merged: Recommendation = { ...previous };
        if (patch.recommender_name !== undefined) merged.recommender_name = patch.recommender_name;
        if (patch.recommender_role !== undefined) merged.recommender_role = patch.recommender_role?.trim() || null;
        if (patch.email !== undefined) merged.email = patch.email?.trim() || null;
        if (patch.type !== undefined) merged.type = patch.type;
        if (patch.status !== undefined) {
            merged.status = patch.status;
            if (patch.status === 'Asked' && !merged.requested_date) {
                merged.requested_date = new Date().toISOString().split('T')[0];
            }
        }
        if (patch.requested_date !== undefined) merged.requested_date = patch.requested_date || null;
        if (patch.deadline !== undefined) merged.deadline = patch.deadline || null;
        if (patch.notes !== undefined) merged.notes = patch.notes?.trim() || null;
        setRecs(prev => prev.map(r => r.id === id ? merged : r));

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await updateRecommendation(id, patch);
            } catch (err) {
                console.error("Update recommendation failed:", err);
                setRecs(prev => prev.map(r => r.id === id ? previous : r));
            }
        });
    };

    const handleDelete = (id: string) => {
        const previous = recs;
        setRecs(prev => prev.filter(r => r.id !== id));
        if (editingId === id) setEditingId(null);

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await deleteRecommendation(id);
            } catch (err) {
                console.error("Delete recommendation failed:", err);
                setRecs(previous);
            }
        });
    };

    const archived = grouped['Submitted'].length + grouped['Declined'].length;

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        Recommendation Letters
                    </h1>
                    <p className="text-muted-foreground">Track who you asked, when, and what's still owed.</p>
                </div>
                <div className="flex items-center gap-2">
                    {pending > 0 && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Button onClick={() => setShowAdd(s => !s)} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Recommender
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
                                    <div className="text-2xl font-bold">{nextDeadline.recommender_name}</div>
                                    <div className="text-sm opacity-80">
                                        {nextDeadline.recommender_role || nextDeadline.type}
                                    </div>
                                </>
                            ) : (
                                <div className="text-lg opacity-80">
                                    {recs.length === 0
                                        ? "No recommenders yet. Add your first one!"
                                        : "No upcoming deadlines."}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 md:flex md:justify-end gap-2 text-sm">
                            <div className="bg-white/15 px-3 py-2 rounded-lg backdrop-blur-md text-center">
                                <div className="text-[10px] uppercase opacity-70">In Progress</div>
                                <div className="text-lg font-bold">{counts.active}</div>
                            </div>
                            <div className="bg-white/15 px-3 py-2 rounded-lg backdrop-blur-md text-center">
                                <div className="text-[10px] uppercase opacity-70">To Ask</div>
                                <div className="text-lg font-bold">{counts.notAsked}</div>
                            </div>
                            <div className="bg-white/15 px-3 py-2 rounded-lg backdrop-blur-md text-center">
                                <div className="text-[10px] uppercase opacity-70">Done</div>
                                <div className="text-lg font-bold">{counts.done}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showAdd && (
                <RecForm
                    onSubmit={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {recs.length === 0 && !showAdd && (
                <Card className="glass-card">
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <MessageSquareQuote className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No recommenders tracked yet.</p>
                        <p className="text-xs mt-1">Click &ldquo;Add Recommender&rdquo; to start tracking your rec letter requests.</p>
                    </CardContent>
                </Card>
            )}

            {/* Active groups */}
            {STATUS_ORDER.map(status => {
                if (status === 'Submitted' || status === 'Declined') return null;
                const list = grouped[status];
                if (list.length === 0) return null;

                return (
                    <div key={status} className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            <span className={cn("inline-block w-2 h-2 rounded-full",
                                status === 'Asked' ? 'bg-amber-500' :
                                    status === 'Confirmed' ? 'bg-blue-500' :
                                        'bg-slate-400'
                            )} />
                            {status} <span className="text-xs opacity-60">({list.length})</span>
                        </div>
                        <div className="space-y-2">
                            {list.map(rec => (
                                <RecCard
                                    key={rec.id}
                                    rec={rec}
                                    isEditing={editingId === rec.id}
                                    onEdit={() => setEditingId(rec.id)}
                                    onCancelEdit={() => setEditingId(null)}
                                    onUpdate={(patch) => {
                                        handleUpdate(rec.id, patch);
                                        setEditingId(null);
                                    }}
                                    onQuickStatus={(s) => handleUpdate(rec.id, { status: s })}
                                    onQuickAsk={() => handleUpdate(rec.id, { status: 'Asked' })}
                                    onDelete={() => handleDelete(rec.id)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Archive (Submitted + Declined) */}
            {archived > 0 && (
                <div className="space-y-3">
                    <button
                        onClick={() => setShowArchive(s => !s)}
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                        {showArchive ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        Archive <span className="text-xs opacity-60">({archived})</span>
                    </button>
                    {showArchive && (
                        <div className="space-y-2">
                            {[...grouped['Submitted'], ...grouped['Declined']].map(rec => (
                                <RecCard
                                    key={rec.id}
                                    rec={rec}
                                    isEditing={editingId === rec.id}
                                    onEdit={() => setEditingId(rec.id)}
                                    onCancelEdit={() => setEditingId(null)}
                                    onUpdate={(patch) => {
                                        handleUpdate(rec.id, patch);
                                        setEditingId(null);
                                    }}
                                    onQuickStatus={(s) => handleUpdate(rec.id, { status: s })}
                                    onQuickAsk={() => handleUpdate(rec.id, { status: 'Asked' })}
                                    onDelete={() => handleDelete(rec.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function RecCard({
    rec, isEditing, onEdit, onCancelEdit, onUpdate, onQuickStatus, onQuickAsk, onDelete,
}: {
    rec: Recommendation;
    isEditing: boolean;
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (patch: Partial<RecommendationInput>) => void;
    onQuickStatus: (s: RecStatus) => void;
    onQuickAsk: () => void;
    onDelete: () => void;
}) {
    if (isEditing) {
        return (
            <RecForm
                initial={rec}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
            />
        );
    }

    const dl = deadlineLabel(rec.deadline);
    const archived = rec.status === 'Submitted' || rec.status === 'Declined';

    return (
        <Card className={cn("glass-card group transition-all hover:shadow-md", archived && "opacity-60")}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="font-semibold leading-tight">{rec.recommender_name}</h3>
                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", TYPE_COLOR[rec.type])}>
                                {rec.type}
                            </span>
                        </div>

                        {rec.recommender_role && (
                            <div className="text-sm text-muted-foreground mt-0.5">{rec.recommender_role}</div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 flex-wrap">
                            {rec.email && (
                                <a
                                    href={`mailto:${rec.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                    <Mail className="h-3 w-3" /> {rec.email}
                                </a>
                            )}
                            {rec.requested_date && (
                                <span>Asked {format(new Date(rec.requested_date + 'T00:00:00'), 'MMM d')}</span>
                            )}
                            <span className={cn(
                                "flex items-center gap-1",
                                dl.tone === 'past' && "text-red-600 font-semibold",
                                dl.tone === 'soon' && "text-amber-600 font-semibold",
                            )}>
                                <CalendarClock className="h-3 w-3" /> {dl.label}
                            </span>
                        </div>

                        {rec.notes && (
                            <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                {rec.notes}
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-1 shrink-0">
                        {rec.status === 'Not Asked' && (
                            <Button
                                size="sm"
                                onClick={onQuickAsk}
                                className="h-7 text-xs gap-1"
                            >
                                <Send className="h-3 w-3" /> Mark asked
                            </Button>
                        )}
                        <Select value={rec.status} onValueChange={(v) => onQuickStatus(v as RecStatus)}>
                            <SelectTrigger className={cn("h-7 text-xs font-semibold border-none w-[110px]", STATUS_COLOR[rec.status])}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Not Asked">Not Asked</SelectItem>
                                <SelectItem value="Asked">Asked</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Declined">Declined</SelectItem>
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
            </CardContent>
        </Card>
    );
}

function RecForm({
    initial, onSubmit, onCancel,
}: {
    initial?: Recommendation;
    onSubmit: (input: RecommendationInput) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(initial?.recommender_name ?? '');
    const [role, setRole] = useState(initial?.recommender_role ?? '');
    const [email, setEmail] = useState(initial?.email ?? '');
    const [type, setType] = useState<RecommenderType>(initial?.type ?? 'Teacher');
    const [status, setStatus] = useState<RecStatus>(initial?.status ?? 'Not Asked');
    const [requestedDate, setRequestedDate] = useState(initial?.requested_date ?? '');
    const [deadline, setDeadline] = useState(initial?.deadline ?? '');
    const [notes, setNotes] = useState(initial?.notes ?? '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSubmit({
            recommender_name: name.trim(),
            recommender_role: role.trim() || null,
            email: email.trim() || null,
            type,
            status,
            requested_date: requestedDate || null,
            deadline: deadline || null,
            notes: notes.trim() || null,
        });
    };

    return (
        <Card className="glass-card border-primary/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4 text-primary" />
                    {initial ? 'Edit recommender' : 'New recommender'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Recommender name *</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Ms. Patel"
                                required
                                autoFocus
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Role / Subject</label>
                            <Input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. AP Bio teacher"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Type</label>
                            <Select value={type} onValueChange={(v) => setType(v as RecommenderType)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                    <SelectItem value="Counselor">Counselor</SelectItem>
                                    <SelectItem value="Coach">Coach</SelectItem>
                                    <SelectItem value="Employer">Employer</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Status</label>
                            <Select value={status} onValueChange={(v) => setStatus(v as RecStatus)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Not Asked">Not Asked</SelectItem>
                                    <SelectItem value="Asked">Asked</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Submitted">Submitted</SelectItem>
                                    <SelectItem value="Declined">Declined</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="optional"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Date asked</label>
                            <Input
                                type="date"
                                value={requestedDate}
                                onChange={(e) => setRequestedDate(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Deadline</label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="What you asked for, talking points, follow-up reminders..."
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">{initial ? 'Save changes' : 'Add recommender'}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
