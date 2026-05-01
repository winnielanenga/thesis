
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Globe, GraduationCap, Mail, CheckCircle2, Trash2, Plus, Loader2, RefreshCw, Target, CalendarRange } from "lucide-react";
import { updateProfile, deleteAccount } from "./actions";
import { CareerPath, Profile } from "@/types/database";
import { signIn } from "next-auth/react";

export function SettingsForm({ profile, userEmail }: { profile: any, userEmail?: string | null }) {
    const [isPending, startTransition] = useTransition();
    const [dreamColleges, setDreamColleges] = useState<string[]>(profile?.dream_colleges || []);
    const [newCollege, setNewCollege] = useState("");
    const [careerPath, setCareerPath] = useState<CareerPath>(profile?.career_path || "Undecided");
    const [targetGpa, setTargetGpa] = useState<string>(
        profile?.target_gpa != null ? String(profile.target_gpa) : ""
    );

    // School year start/end dates as YYYY-MM-DD strings, with year fixed to a
    // dummy reference. Only the month + day are persisted on save.
    const monthDayToInputValue = (month: number | null | undefined, day: number | null | undefined, fallbackMonth: number, fallbackDay: number) => {
        const m = (month ?? fallbackMonth) + 1; // 0-11 -> 1-12
        const d = day ?? fallbackDay;
        return `2000-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    };
    const [schoolYearStart, setSchoolYearStart] = useState<string>(
        monthDayToInputValue(profile?.school_year_start_month, profile?.school_year_start_day, 8, 1)
    );
    const [schoolYearEnd, setSchoolYearEnd] = useState<string>(
        monthDayToInputValue(profile?.school_year_end_month, profile?.school_year_end_day, 5, 15)
    );

    const handleSchoolYearChange = (newStart: string, newEnd: string) => {
        setSchoolYearStart(newStart);
        setSchoolYearEnd(newEnd);
        const [, sm, sd] = newStart.split('-').map(Number);
        const [, em, ed] = newEnd.split('-').map(Number);
        if (!sm || !sd || !em || !ed) return;
        startTransition(() => updateProfile({
            schoolYear: {
                startMonth: sm - 1,
                startDay: sd,
                endMonth: em - 1,
                endDay: ed,
            },
        }));
    };

    const handleTargetGpaBlur = () => {
        const trimmed = targetGpa.trim();
        if (trimmed === "") {
            startTransition(() => updateProfile({ targetGpa: null }));
            return;
        }
        const parsed = parseFloat(trimmed);
        if (isNaN(parsed) || parsed < 0 || parsed > 5) {
            // Reset to last known good value from profile
            setTargetGpa(profile?.target_gpa != null ? String(profile.target_gpa) : "");
            return;
        }
        startTransition(() => updateProfile({ targetGpa: parsed }));
    };

    const handleAddCollege = () => {
        if (!newCollege.trim()) return;
        const updated = [...dreamColleges, newCollege.trim()];
        setDreamColleges(updated);
        setNewCollege("");
        startTransition(() => updateProfile({ dreamColleges: updated }));
    };

    const handleRemoveCollege = (college: string) => {
        const updated = dreamColleges.filter(c => c !== college);
        setDreamColleges(updated);
        startTransition(() => updateProfile({ dreamColleges: updated }));
    };

    const handleCareerChange = (path: CareerPath) => {
        setCareerPath(path);
        startTransition(() => updateProfile({ careerPath: path }));
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteText, setDeleteText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteAccount();
            localStorage.removeItem('thesisprep-dismissed-notifications');
            window.location.href = "/";
        } catch {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                Settings
            </h1>

            {/* Connected Accounts */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Connected Accounts
                    </CardTitle>
                    <CardDescription>Manage your connections.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-white/50">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-medium">Google Account</div>
                                <div className="text-xs text-muted-foreground">{userEmail}</div>
                            </div>
                        </div>
                        <Button variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Connected
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dream Schools */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Dream Schools
                    </CardTitle>
                    <CardDescription>Your target university list.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a university (e.g. Stanford)..."
                            value={newCollege}
                            onChange={(e) => setNewCollege(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCollege()}
                            className="bg-white/50 backdrop-blur-sm"
                        />
                        <Button onClick={handleAddCollege} disabled={isPending}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {dreamColleges.map((school) => (
                            <div key={school} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in zoom-in-95">
                                {school}
                                <button onClick={() => handleRemoveCollege(school)} className="hover:text-foreground">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                        {dreamColleges.length === 0 && (
                            <span className="text-sm text-muted-foreground italic">No dream schools added yet.</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Academic Goal */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-gold" />
                        Academic Goal
                    </CardTitle>
                    <CardDescription>The weighted GPA you're aiming for. Shown on the Academics page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={targetGpa}
                            onChange={(e) => setTargetGpa(e.target.value)}
                            onBlur={handleTargetGpaBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
                            }}
                            placeholder="e.g. 3.8"
                            className="h-12 max-w-[140px] bg-white/50 backdrop-blur-sm text-lg font-semibold"
                        />
                        <span className="text-sm text-muted-foreground">/ 5.0 (weighted)</span>
                        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                </CardContent>
            </Card>

            {/* School Year */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarRange className="h-5 w-5 text-primary" />
                        School Year
                    </CardTitle>
                    <CardDescription>The first and last day of your school year. Used by the Planner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Starts</label>
                            <Input
                                type="date"
                                value={schoolYearStart}
                                onChange={(e) => handleSchoolYearChange(e.target.value, schoolYearEnd)}
                                className="mt-1 bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground">Ends</label>
                            <Input
                                type="date"
                                value={schoolYearEnd}
                                onChange={(e) => handleSchoolYearChange(schoolYearStart, e.target.value)}
                                className="mt-1 bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Only the month and day are saved &mdash; the year on the picker is just a placeholder.
                    </p>
                </CardContent>
            </Card>

            {/* Career Path */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-orange-500" />
                        Career Path
                    </CardTitle>
                    <CardDescription>Updating this re-generates your Roadmap.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={careerPath} onValueChange={(val) => handleCareerChange(val as CareerPath)}>
                        <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Law & Political Science">⚖️ Law & Political Science</SelectItem>
                            <SelectItem value="Literature & Creative Writing">✍️ Literature & Creative Writing</SelectItem>
                            <SelectItem value="Business Administration">💼 Business Administration</SelectItem>
                            <SelectItem value="Economics & Finance">📈 Economics & Finance</SelectItem>
                            <SelectItem value="Computer Science">💻 Computer Science</SelectItem>
                            <SelectItem value="Engineering (Mech/Civil/Elec)">⚙️ Engineering (Mech/Civil/Elec)</SelectItem>
                            <SelectItem value="Medicine & Health Sciences">🩺 Medicine & Health Sciences</SelectItem>
                            <SelectItem value="Psychology & Social Sciences">🧠 Psychology & Social Sciences</SelectItem>
                            <SelectItem value="Visual Arts & Design">🎨 Visual Arts & Design</SelectItem>
                            <SelectItem value="Architecture">🏛️ Architecture</SelectItem>
                            <SelectItem value="Undecided">❓ Undecided</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Account
                    </CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data. This cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!showDeleteConfirm ? (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" /> Delete My Account
                        </Button>
                    ) : (
                        <div className="space-y-3 p-4 border border-red-200 rounded-xl bg-white">
                            <p className="text-sm font-medium text-red-700">
                                Type <span className="font-mono font-bold">delete my account</span> to confirm:
                            </p>
                            <Input
                                value={deleteText}
                                onChange={(e) => setDeleteText(e.target.value)}
                                placeholder="delete my account"
                                className="border-red-200 focus-visible:ring-red-400"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    disabled={deleteText.trim().toLowerCase() !== "delete my account" || isDeleting}
                                    onClick={handleDeleteAccount}
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
