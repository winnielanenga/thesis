
"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Plus, X, BookOpen, ClipboardList, CalendarClock, Target, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast, isToday } from "date-fns";
import { useCelebration } from "@/hooks/use-celebration";
import {
    Course, Exam, CourseType, LetterGrade, TermSeason,
} from "@/types/database";
import {
    addCourse, updateCourse, deleteCourse, addExam, deleteExam,
} from "./actions";

const GRADE_RANK: Record<string, number> = {
    'F': 0, 'D': 1, 'C-': 2, 'C': 3, 'C+': 4,
    'B-': 5, 'B': 6, 'B+': 7, 'A-': 8, 'A': 9, 'A+': 10,
};

const ALL_GRADES: LetterGrade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

type Term = { season: TermSeason; year: number };

function getCurrentTerm(): Term {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    if (month >= 7 && month <= 10) return { season: 'Fall', year };
    if (month === 11) return { season: 'Winter', year };
    if (month <= 1) return { season: 'Winter', year: year - 1 };
    return { season: 'Spring', year: year - 1 };
}

function termKey(t: Term): string {
    return `${t.season}-${t.year}`;
}

function termLabel(t: Term): string {
    if (t.season === 'Fall') return `Fall ${t.year}`;
    if (t.season === 'Spring') return `Spring ${t.year + 1}`;
    return `Winter ${t.year}–${(t.year + 1).toString().slice(-2)}`;
}

const SEASON_ORDER: Record<TermSeason, number> = { Fall: 0, Winter: 1, Spring: 2 };
function compareTerms(a: Term, b: Term): number {
    if (a.year !== b.year) return a.year - b.year;
    return SEASON_ORDER[a.season] - SEASON_ORDER[b.season];
}

function gradePoints(grade: LetterGrade, type: CourseType): number {
    let base = 0;
    if (grade.startsWith("A")) base = 4.0;
    else if (grade.startsWith("B")) base = 3.0;
    else if (grade.startsWith("C")) base = 2.0;
    else if (grade.startsWith("D")) base = 1.0;
    if (grade.includes("+") && base < 4) base += 0.3;
    if (grade.includes("-")) base -= 0.3;
    if (type === "AP/IB") base += 1.0;
    if (type === "Honors") base += 0.5;
    return base;
}

function calcGpa(courses: Course[]): { gpa: number; credits: number } | null {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
        if (!c.grade) return;
        totalPoints += gradePoints(c.grade, c.type) * c.credits;
        totalCredits += c.credits;
    });
    if (totalCredits === 0) return null;
    return { gpa: totalPoints / totalCredits, credits: totalCredits };
}

interface AcademicsViewProps {
    initialCourses: Course[];
    initialExams: Exam[];
    targetGpa: number | null;
}

export function AcademicsView({
    initialCourses, initialExams, targetGpa,
}: AcademicsViewProps) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [exams, setExams] = useState<Exam[]>(initialExams);
    const [showAddExam, setShowAddExam] = useState(false);
    const [, startTransition] = useTransition();
    const [pendingCount, setPendingCount] = useState(0);
    const { firework } = useCelebration();

    const current = useMemo(() => getCurrentTerm(), []);
    const [activeTerm, setActiveTerm] = useState<Term>(current);

    // Distinct terms that have courses, plus current term, sorted chronologically.
    const knownTerms = useMemo(() => {
        const seen = new Map<string, Term>();
        seen.set(termKey(current), current);
        seen.set(termKey(activeTerm), activeTerm);
        courses.forEach(c => {
            const t = { season: c.term_season, year: c.term_year };
            seen.set(termKey(t), t);
        });
        return Array.from(seen.values()).sort(compareTerms);
    }, [courses, current, activeTerm]);

    const activeCourses = courses.filter(
        c => c.term_season === activeTerm.season && c.term_year === activeTerm.year
    );
    const termGpa = calcGpa(activeCourses);
    const cumulativeGpa = calcGpa(courses);

    // Wraps a server action with optimistic state + pending counter.
    const runWithPending = (fn: () => Promise<void>) => {
        setPendingCount(c => c + 1);
        startTransition(async () => {
            try {
                await fn();
            } finally {
                setPendingCount(c => c - 1);
            }
        });
    };

    const handleAddCourse = () => {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const optimistic: Course = {
            id: tempId,
            user_id: '',
            name: 'New Course',
            type: 'Regular',
            grade: null,
            credits: 1,
            term_season: activeTerm.season,
            term_year: activeTerm.year,
            grade_level: null,
            created_at: new Date().toISOString(),
        };
        setCourses(prev => [...prev, optimistic]);

        runWithPending(async () => {
            try {
                const real = await addCourse({
                    name: optimistic.name,
                    type: optimistic.type,
                    credits: optimistic.credits,
                    term_season: optimistic.term_season,
                    term_year: optimistic.term_year,
                });
                if (real) {
                    setCourses(prev => prev.map(c => c.id === tempId ? (real as Course) : c));
                }
            } catch (err) {
                console.error("Add course failed:", err);
                setCourses(prev => prev.filter(c => c.id !== tempId));
            }
        });
    };

    const handleUpdateCourse = <K extends keyof Course>(id: string, field: K, value: Course[K]) => {
        const previous = courses.find(c => c.id === id);
        if (!previous) return;

        if (field === 'grade' && value && previous.grade) {
            const before = GRADE_RANK[previous.grade] ?? -1;
            const after = GRADE_RANK[value as string] ?? -1;
            if (after > before) firework();
        }

        setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

        // Skip server call for unsaved optimistic rows
        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await updateCourse(id, { [field]: value } as Partial<Course>);
            } catch (err) {
                console.error("Update course failed:", err);
                setCourses(prev => prev.map(c => c.id === id ? previous : c));
            }
        });
    };

    const handleDeleteCourse = (id: string) => {
        const previous = courses;
        setCourses(prev => prev.filter(c => c.id !== id));
        // Drop any exams pointing at this course locally — server CASCADE handles persistence
        setExams(prev => prev.filter(e => e.course_id !== id));

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await deleteCourse(id);
            } catch (err) {
                console.error("Delete course failed:", err);
                setCourses(previous);
            }
        });
    };

    const handleAddExam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const courseId = formData.get("courseId") as string;
        const examName = (formData.get("examName") as string)?.trim();
        const date = formData.get("date") as string;

        if (!courseId || !examName || !date) return;
        if (courseId.startsWith('temp-')) return;

        const tempId = `temp-${Date.now()}`;
        const optimistic: Exam = {
            id: tempId,
            user_id: '',
            course_id: courseId,
            exam_name: examName,
            date,
            created_at: new Date().toISOString(),
        };
        setExams(prev => [...prev, optimistic]);
        setShowAddExam(false);
        form.reset();

        runWithPending(async () => {
            try {
                const real = await addExam({ course_id: courseId, exam_name: examName, date });
                if (real) {
                    setExams(prev => prev.map(x => x.id === tempId ? (real as Exam) : x));
                }
            } catch (err) {
                console.error("Add exam failed:", err);
                setExams(prev => prev.filter(x => x.id !== tempId));
            }
        });
    };

    const handleDeleteExam = (id: string) => {
        const previous = exams;
        setExams(prev => prev.filter(e => e.id !== id));

        if (id.startsWith('temp-')) return;

        runWithPending(async () => {
            try {
                await deleteExam(id);
            } catch (err) {
                console.error("Delete exam failed:", err);
                setExams(previous);
            }
        });
    };

    const upcomingExams = exams
        .filter(e => {
            const d = new Date(e.date + 'T00:00:00');
            return !isPast(d) || isToday(d);
        })
        .sort((a, b) => a.date.localeCompare(b.date));
    const nextExam = upcomingExams[0] ?? null;
    const pastExams = exams.filter(e => {
        const d = new Date(e.date + 'T00:00:00');
        return isPast(d) && !isToday(d);
    });

    const courseNameById = (id: string) => courses.find(c => c.id === id)?.name ?? 'Unknown course';

    const getExamCountdown = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        if (isToday(d)) return "Today";
        const days = differenceInDays(d, new Date());
        if (days === 1) return "Tomorrow";
        return `in ${days} days`;
    };

    const targetProgress = targetGpa && cumulativeGpa
        ? Math.min(100, Math.max(0, (cumulativeGpa.gpa / targetGpa) * 100))
        : 0;

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        Academics
                    </h1>
                    <p className="text-muted-foreground">Track your grades and calculate your GPA.</p>
                </div>
                <div className="flex items-center gap-2">
                    {pendingCount > 0 && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                </div>
            </div>

            {/* GPA Card */}
            <Card className="glass-card">
                <CardContent className="p-5">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border-l-4 border-l-primary pl-4">
                            <div className="text-xs text-muted-foreground font-semibold uppercase">{termLabel(activeTerm)} GPA</div>
                            <div className="text-3xl font-bold text-foreground">
                                {termGpa ? termGpa.gpa.toFixed(2) : "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {termGpa ? `${termGpa.credits} credits` : "No graded courses yet"}
                            </div>
                        </div>
                        <div className="border-l-4 border-l-gold pl-4">
                            <div className="text-xs text-muted-foreground font-semibold uppercase">Cumulative GPA</div>
                            <div className="text-3xl font-bold text-foreground">
                                {cumulativeGpa ? cumulativeGpa.gpa.toFixed(2) : "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {cumulativeGpa ? `${cumulativeGpa.credits} credits across all terms` : "No grades recorded yet"}
                            </div>
                        </div>
                        <div className="border-l-4 border-l-emerald-500 pl-4">
                            <div className="text-xs text-muted-foreground font-semibold uppercase flex items-center gap-1.5">
                                <Target className="h-3 w-3" /> Target
                            </div>
                            {targetGpa != null ? (
                                <>
                                    <div className="text-3xl font-bold text-foreground">{targetGpa.toFixed(2)}</div>
                                    <Progress value={targetProgress} className="mt-2 h-2" />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {cumulativeGpa
                                            ? `${targetProgress.toFixed(0)}% of the way there`
                                            : "Start logging grades to see progress"}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-3xl font-bold text-muted-foreground">—</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Set a goal in <a href="/settings" className="underline">Settings</a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Term picker */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Term:</span>
                <Select
                    value={termKey(activeTerm)}
                    onValueChange={(v) => {
                        const found = knownTerms.find(t => termKey(t) === v);
                        if (found) setActiveTerm(found);
                    }}
                >
                    <SelectTrigger className="w-[200px] bg-white/50">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {knownTerms.map(t => (
                            <SelectItem key={termKey(t)} value={termKey(t)}>
                                {termLabel(t)}{termKey(t) === termKey(current) ? ' (current)' : ''}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Course List */}
                <Card className="md:col-span-2 glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            {termLabel(activeTerm)}
                        </CardTitle>
                        <Button size="sm" onClick={handleAddCourse} className="gap-2">
                            <Plus className="h-4 w-4" /> Add Class
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeCourses.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground text-sm">
                                No courses for {termLabel(activeTerm)} yet. Click &ldquo;Add Class&rdquo; to start.
                            </div>
                        )}
                        {activeCourses.map((course) => (
                            <div key={course.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/50 border hover:border-primary/30 transition-colors">
                                <div className="col-span-4">
                                    <Input
                                        value={course.name}
                                        onChange={(e) => handleUpdateCourse(course.id, "name", e.target.value)}
                                        onBlur={(e) => {
                                            // Persist the final name once focus leaves (debounces typing)
                                            if (!course.id.startsWith('temp-')) {
                                                runWithPending(async () => {
                                                    try {
                                                        await updateCourse(course.id, { name: e.target.value });
                                                    } catch (err) {
                                                        console.error("Save course name failed:", err);
                                                    }
                                                });
                                            }
                                        }}
                                        className="bg-transparent border-none shadow-none focus-visible:ring-0 font-medium h-auto p-0"
                                        placeholder="Course Name"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Select value={course.type} onValueChange={(val) => handleUpdateCourse(course.id, "type", val as CourseType)}>
                                        <SelectTrigger className="h-8 text-xs bg-black/5 border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Regular">Regular</SelectItem>
                                            <SelectItem value="Honors">Honors (+0.5)</SelectItem>
                                            <SelectItem value="AP/IB">AP/IB (+1.0)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Select
                                        value={course.grade ?? "__ungraded"}
                                        onValueChange={(val) => handleUpdateCourse(course.id, "grade", val === "__ungraded" ? null : (val as LetterGrade))}
                                    >
                                        <SelectTrigger className={cn(
                                            "h-8 font-bold border-none",
                                            !course.grade ? 'text-muted-foreground bg-muted/30' :
                                                course.grade.startsWith('A') ? 'text-emerald-600 bg-emerald-100' :
                                                    course.grade.startsWith('B') ? 'text-blue-600 bg-blue-100' :
                                                        course.grade.startsWith('C') ? 'text-yellow-600 bg-yellow-100' :
                                                            'text-red-600 bg-red-100'
                                        )}>
                                            <SelectValue placeholder="—" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__ungraded">— (in progress)</SelectItem>
                                            {ALL_GRADES.map(g => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        min="0.5"
                                        max="10"
                                        step="0.5"
                                        value={course.credits}
                                        onChange={(e) => {
                                            const v = parseFloat(e.target.value);
                                            if (!isNaN(v) && v > 0 && v <= 10) {
                                                handleUpdateCourse(course.id, "credits", v);
                                            }
                                        }}
                                        className="h-8 text-center text-xs bg-black/5 border-none"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Next Exam Card */}
                    <Card className={cn(
                        "glass-card border-none",
                        nextExam
                            ? "bg-gradient-to-br from-primary to-primary/80 text-white"
                            : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                    )}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg opacity-90">Next Exam</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextExam ? (
                                <>
                                    <div className="text-2xl font-bold mb-1">{courseNameById(nextExam.course_id)}</div>
                                    <div className="text-primary-foreground/70 text-sm mb-4">{nextExam.exam_name}</div>
                                    <div className="flex gap-2">
                                        <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md">
                                            {getExamCountdown(nextExam.date)}
                                        </div>
                                        <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md">
                                            {format(new Date(nextExam.date + 'T00:00:00'), 'MMM d')}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm opacity-70">No upcoming exams. Add one below!</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Exams List */}
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ClipboardList className="h-4 w-4 text-primary" />
                                Upcoming Exams
                            </CardTitle>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowAddExam(true)}
                                disabled={activeCourses.filter(c => !c.id.startsWith('temp-')).length === 0}
                                className="gap-1 h-8 text-xs"
                            >
                                <Plus className="h-3 w-3" /> Add Exam
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {showAddExam && (
                                <form onSubmit={handleAddExam} className="space-y-2 p-3 rounded-xl border border-primary/30 bg-primary/5">
                                    <Select name="courseId" required>
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeCourses
                                                .filter(c => !c.id.startsWith('temp-'))
                                                .map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        name="examName"
                                        placeholder="e.g. Unit 3 Test, Midterm, Quiz 5"
                                        required
                                        className="h-9 text-sm"
                                    />
                                    <Input
                                        name="date"
                                        type="date"
                                        required
                                        className="h-9 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" size="sm" className="flex-1 h-8 text-xs">Add</Button>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddExam(false)} className="h-8 text-xs">Cancel</Button>
                                    </div>
                                </form>
                            )}

                            {upcomingExams.length > 0 ? (
                                upcomingExams.map(exam => (
                                    <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border hover:border-primary/30 transition-colors group">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="mt-0.5">
                                                <CalendarClock className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-sm truncate">{courseNameById(exam.course_id)}</div>
                                                <div className="text-xs text-muted-foreground truncate">{exam.exam_name}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="text-xs text-muted-foreground text-right">
                                                <div>{format(new Date(exam.date + 'T00:00:00'), 'MMM d')}</div>
                                                <div className="text-[10px] font-medium text-primary">{getExamCountdown(exam.date)}</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteExam(exam.id)}
                                                className="h-7 w-7 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : !showAddExam ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No upcoming exams</p>
                                    <p className="text-xs mt-1">
                                        {activeCourses.filter(c => !c.id.startsWith('temp-')).length === 0
                                            ? "Add a class first to track exams"
                                            : 'Click "Add Exam" to track your next test'}
                                    </p>
                                </div>
                            ) : null}

                            {pastExams.length > 0 && (
                                <div className="pt-2 border-t">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">Past</div>
                                    {pastExams.map(exam => (
                                        <div key={exam.id} className="flex items-center justify-between p-2 rounded-lg opacity-50">
                                            <div className="text-xs">
                                                <span className="font-medium">{courseNameById(exam.course_id)}</span>
                                                <span className="text-muted-foreground"> — {exam.exam_name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteExam(exam.id)}
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

