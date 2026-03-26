
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
import { Globe, GraduationCap, Mail, CheckCircle2, Trash2, Plus, Loader2, RefreshCw } from "lucide-react";
import { updateProfile, resetAccount } from "./actions";
import { CareerPath, Profile } from "@/types/database";
import { signIn } from "next-auth/react";

export function SettingsForm({ profile, userEmail }: { profile: any, userEmail?: string | null }) {
    const [isPending, startTransition] = useTransition();
    const [dreamColleges, setDreamColleges] = useState<string[]>(profile?.dream_colleges || []);
    const [newCollege, setNewCollege] = useState("");
    const [careerPath, setCareerPath] = useState<CareerPath>(profile?.career_path || "Undecided");

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

    const handleReset = async () => {
        if (confirm("Are you sure? This will wipe ALL your data permanently.")) {
            await resetAccount();
            window.location.href = "/";
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-500">
                Settings
            </h1>

            {/* Connected Accounts */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-500" />
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
                        <GraduationCap className="h-5 w-5 text-purple-500" />
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
                            <div key={school} className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in zoom-in-95">
                                {school}
                                <button onClick={() => handleRemoveCollege(school)} className="hover:text-purple-900">
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
            <div className="flex justify-end pt-4">
                <Button variant="destructive" onClick={handleReset} className="gap-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-200">
                    <Trash2 className="h-4 w-4" /> Reset Account Data
                </Button>
            </div>
        </div>
    );
}
