
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { completeOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sparkles, GraduationCap, Briefcase, School, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session) redirect("/");

    // If user already completed onboarding, redirect to dashboard
    const { data: profile } = await supabase
        .from('profiles')
        .select('graduation_year, career_path')
        .eq('id', session.user?.id)
        .single();

    if (profile?.graduation_year && profile?.career_path) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-muted p-4">
            <Card className="w-full max-w-lg glass-card border-none shadow-2xl">
                <CardHeader className="text-center space-y-2 pb-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        Welcome, {session.user?.name?.split(" ")[0]}!
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Let's personalize your high school roadmap.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={completeOnboarding} className="space-y-6">

                        <div className="space-y-2">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Graduation Year
                            </Label>
                            <Select name="graduationYear" required>
                                <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm border-border focus:ring-primary">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            Class of {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Intended Career Path
                            </Label>
                            <Select name="careerPath" required>
                                <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm border-border focus:ring-primary">
                                    <SelectValue placeholder="Choose your area of interest" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
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
                            <p className="text-xs text-muted-foreground pt-1">
                                This helps us generate your 4-year milestone roadmap. You can change this later.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <School className="h-4 w-4 text-emerald-500" />
                                Dream Colleges
                                <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                            </Label>
                            <Input
                                name="dreamColleges"
                                placeholder="e.g. MIT, Stanford, UCLA"
                                className="h-12 bg-white/50 backdrop-blur-sm border-border focus:ring-primary"
                            />
                            <p className="text-xs text-muted-foreground pt-1">
                                Separate multiple schools with commas.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Target className="h-4 w-4 text-gold" />
                                Target GPA
                                <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                            </Label>
                            <Input
                                name="targetGpa"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="e.g. 3.8"
                                defaultValue="4.0"
                                className="h-12 bg-white/50 backdrop-blur-sm border-border focus:ring-primary"
                            />
                            <p className="text-xs text-muted-foreground pt-1">
                                Your weighted GPA goal. You can change this anytime in Settings.
                            </p>
                        </div>

                        <Button type="submit" size="lg" className="w-full text-base font-semibold h-12 rounded-xl shadow-lg shadow-primary/20">
                            Create My Roadmap
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
