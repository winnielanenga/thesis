
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, BookOpen, GraduationCap, Calculator } from "lucide-react";

type Course = {
    id: string;
    name: string;
    grade: string;
    credits: number;
    type: "Regular" | "Honors" | "AP/IB";
};

export default function AcademicsPage() {
    const [courses, setCourses] = useState<Course[]>([
        { id: "1", name: "AP World History", grade: "A", credits: 1, type: "AP/IB" },
        { id: "2", name: "Honors Chemistry", grade: "B+", credits: 1, type: "Honors" },
        { id: "3", name: "Algebra II", grade: "A-", credits: 1, type: "Regular" },
    ]);

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(c => {
            let base = 0;
            if (c.grade.startsWith("A")) base = 4.0;
            else if (c.grade.startsWith("B")) base = 3.0;
            else if (c.grade.startsWith("C")) base = 2.0;
            else if (c.grade.startsWith("D")) base = 1.0;

            // Pluses and Minuses
            if (c.grade.includes("+") && base < 4) base += 0.3;
            if (c.grade.includes("-")) base -= 0.3;

            // Weighting
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

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                        Academics
                    </h1>
                    <p className="text-muted-foreground">Track your grades and calculate your GPA.</p>
                </div>
                <div className="flex gap-4">
                    <Card className="glass-card w-[180px] border-l-4 border-l-indigo-500">
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
                            <BookOpen className="h-5 w-5 text-indigo-500" />
                            Current Schedule
                        </CardTitle>
                        <Button size="sm" onClick={addCourse} className="gap-2">
                            <Plus className="h-4 w-4" /> Add Class
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {courses.map((course) => (
                            <div key={course.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/50 dark:bg-black/20 border hover:border-indigo-200 transition-colors">
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
                                        <SelectTrigger className="h-8 text-xs bg-black/5 dark:bg-white/10 border-none">
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

                {/* Dashboard Widgets */}
                <div className="space-y-6">
                    <Card className="glass-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-lg opacity-90">Next Exam</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-1">AP World History</div>
                            <div className="text-indigo-100 text-sm mb-4">Unit 3 Test</div>
                            <div className="flex gap-2">
                                <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md">
                                    in 4 days
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
