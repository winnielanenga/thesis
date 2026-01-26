
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { completeOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sparkles, GraduationCap, Briefcase } from "lucide-react";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session) redirect("/");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:to-indigo-950 p-4">
            <Card className="w-full max-w-lg glass-card border-none shadow-2xl">
                <CardHeader className="text-center space-y-2 pb-8">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
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
                                <GraduationCap className="h-4 w-4 text-indigo-500" />
                                Graduation Year
                            </Label>
                            <Select name="graduationYear" required>
                                <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm border-indigo-100 focus:ring-indigo-500">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            Class of {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-purple-500" />
                                Intended Career Path
                            </Label>
                            <Select name="careerPath" required>
                                <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm border-indigo-100 focus:ring-indigo-500">
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

                        <Button type="submit" size="lg" className="w-full text-base font-semibold h-12 rounded-xl shadow-lg shadow-indigo-500/20">
                            Create My Roadmap
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
