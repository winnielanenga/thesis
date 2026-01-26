
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    GraduationCap,
    Brain,
    LogOut,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    // Fetch Graduation Year for Header
    // Note: session.user.id in NextAuth Google provider is the 'sub'. 
    // We used this 'sub' as the ID in our profiles table during onboarding.
    const { data: profile } = await supabase
        .from('profiles')
        .select('graduation_year')
        .eq('id', session.user.id)
        .single();

    // Fallback if not found (e.g. legacy user or onboarding skipped somehow) - default to current year + 4
    const gradYear = profile?.graduation_year || new Date().getFullYear() + 4;

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Planner", href: "/planner", icon: Calendar },
        { name: "Academics", href: "/academics", icon: BookOpen },
        { name: "College Prep", href: "/college-prep", icon: GraduationCap },
        { name: "Studying", href: "/studying", icon: Brain },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-black/40 backdrop-blur-md sticky top-0 h-screen">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Pathfinder
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-white transition-all"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-indigo-100 dark:border-white/10 m-4 rounded-xl bg-indigo-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                            {session.user?.name?.[0]}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">{session.user?.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{session.user?.email}</div>
                        </div>
                    </div>
                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </Button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header graduationYear={gradYear} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
