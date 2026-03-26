
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, BookOpen, ClipboardList, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast, isToday } from "date-fns";

type Course = {
    id: string;
    name: string;
    grade: string;
    credits: number;
    type: "Regular" | "Honors" | "AP/IB";
};

type Exam = {
    id: string;
    courseName: string;
    examName: string;
    date: string; // YYYY-MM-DD
};

export default function AcademicsPage() {
    const [courses, setCourses] = useState<Course[]>([]);

    const [exams, setExams] = useState<Exam[]>([]);
    const [showAddExam, setShowAddExam] = useState(false);

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(c => {
            let base = 0;
            if (c.grade.startsWith("A")) base = 4.0;
            else if (c.grade.startsWith("B")) base = 3.0;
            else if (c.grade.startsWith("C")) base = 2.0;
            else if (c.grade.startsWith("D")) base = 1.0;

            if (c.grade.includes("+") && base < 4) base += 0.3;
            if (c.grade.includes("-")) base -= 0.3;

            if (c.type === "AP/IB") base += 1.0;
            if (c.type === "Honors") base += 0.5;

            totalPoints += base * c.credits;
            totalCredits += c.credits;
        });

        return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
    };

    const addCourse = () => {
        const newCourse: Course = {
            id: Math.random().toString(),
            name: "New Course",
            grade: "A",
            credits: 1,
            type: "Regular"
        };
        setCourses([...courses, newCourse]);
    };

    const updateCourse = (id: string, field: keyof Course, value: any) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const addExam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const courseName = (formData.get("courseName") as string)?.trim();
        const examName = (formData.get("examName") as string)?.trim();
        const date = formData.get("date") as string;

        if (!courseName || !examName || !date) return;

        setExams([...exams, {
            id: Math.random().toString(),
            courseName,
            examName,
            date,
        }]);
        setShowAddExam(false);
        form.reset();
    };

    // Next exam: soonest upcoming (today or future), sorted by date
    const upcomingExams = exams
        .filter(e => {
            const d = new Date(e.date + 'T00:00:00');
            return !isPast(d) || isToday(d);
        })
        .sort((a, b) => a.date.localeCompare(b.date));

    const nextExam = upcomingExams[0] ?? null;

    const getExamCountdown = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        if (isToday(d)) return "Today";
        const days = differenceInDays(d, new Date());
        if (days === 1) return "Tomorrow";
        return `in ${days} days`;
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-500">
                        Academics
                    </h1>
                    <p className="text-muted-foreground">Track your grades and calculate your GPA.</p>
                </div>
                <div className="flex gap-4">
                    <Card className="glass-card w-[180px] border-l-4 border-l-purple-500">
                        <CardContent className="p-4 py-3">
                            <div className="text-xs text-muted-foreground font-semibold uppercase">Weighted GPA</div>
                            <div className="text-3xl font-bold text-foreground">{calculateGPA()}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Course List */}
                <Card className="md:col-span-2 glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-500" />
                            Current Schedule
                        </CardTitle>
                        <Button size="sm" onClick={addCourse} className="gap-2">
                            <Plus className="h-4 w-4" /> Add Class
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {courses.map((course) => (
                            <div key={course.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/50 border hover:border-purple-200 transition-colors">
                                <div className="col-span-4">
                                    <Input
                                        value={course.name}
                                        onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                                        className="bg-transparent border-none shadow-none focus-visible:ring-0 font-medium h-auto p-0"
                                        placeholder="Course Name"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Select value={course.type} onValueChange={(val) => updateCourse(course.id, "type", val)}>
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
                                    <Select value={course.grade} onValueChange={(val) => updateCourse(course.id, "grade", val)}>
                                        <SelectTrigger className={`h-8 font-bold border-none ${course.grade.startsWith('A') ? 'text-emerald-600 bg-emerald-100' :
                                                course.grade.startsWith('B') ? 'text-blue-600 bg-blue-100' :
                                                    course.grade.startsWith('C') ? 'text-yellow-600 bg-yellow-100' :
                                                        'text-red-600 bg-red-100'
                                            }`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(g => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 text-xs text-center text-muted-foreground">
                                    {course.credits} Credit
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Button variant="ghost" size="icon" onClick={() => setCourses(courses.filter(c => c.id !== course.id))} className="h-8 w-8 text-muted-foreground hover:text-red-500">
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
                            ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white"
                            : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                    )}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg opacity-90">Next Exam</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextExam ? (
                                <>
                                    <div className="text-2xl font-bold mb-1">{nextExam.courseName}</div>
                                    <div className="text-purple-100 text-sm mb-4">{nextExam.examName}</div>
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
                                <ClipboardList className="h-4 w-4 text-purple-500" />
                                Upcoming Exams
                            </CardTitle>
                            <Button size="sm" variant="outline" onClick={() => setShowAddExam(true)} className="gap-1 h-8 text-xs">
                                <Plus className="h-3 w-3" /> Add Exam
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Add exam form */}
                            {showAddExam && (
                                <form onSubmit={addExam} className="space-y-2 p-3 rounded-xl border border-purple-300 bg-purple-50/50">
                                    <Select name="courseName" required>
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses.map(c => (
                                                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
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

                            {/* Exam list */}
                            {upcomingExams.length > 0 ? (
                                upcomingExams.map(exam => (
                                    <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border hover:border-purple-200 transition-colors group">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="mt-0.5">
                                                <CalendarClock className="h-4 w-4 text-purple-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-sm truncate">{exam.courseName}</div>
                                                <div className="text-xs text-muted-foreground truncate">{exam.examName}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="text-xs text-muted-foreground text-right">
                                                <div>{format(new Date(exam.date + 'T00:00:00'), 'MMM d')}</div>
                                                <div className="text-[10px] font-medium text-purple-500">{getExamCountdown(exam.date)}</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setExams(exams.filter(e => e.id !== exam.id))}
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
                                    <p className="text-xs mt-1">Click "Add Exam" to track your next test</p>
                                </div>
                            ) : null}

                            {/* Past exams */}
                            {exams.filter(e => {
                                const d = new Date(e.date + 'T00:00:00');
                                return isPast(d) && !isToday(d);
                            }).length > 0 && (
                                <div className="pt-2 border-t">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">Past</div>
                                    {exams.filter(e => {
                                        const d = new Date(e.date + 'T00:00:00');
                                        return isPast(d) && !isToday(d);
                                    }).map(exam => (
                                        <div key={exam.id} className="flex items-center justify-between p-2 rounded-lg opacity-50">
                                            <div className="text-xs">
                                                <span className="font-medium">{exam.courseName}</span>
                                                <span className="text-muted-foreground"> — {exam.examName}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setExams(exams.filter(e => e.id !== exam.id))}
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
