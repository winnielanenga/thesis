import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    GraduationCap,
    Brain,
    Settings,
    FileText,
    Trophy,
    MessageSquareQuote,
    BookCheck,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "Academics", href: "/academics", icon: BookOpen },
    { name: "Test Prep", href: "/test-prep", icon: BookCheck },
    { name: "College Prep", href: "/college-prep", icon: GraduationCap },
    { name: "College Essays", href: "/essays", icon: FileText },
    { name: "Rec Letters", href: "/recommendations", icon: MessageSquareQuote },
    { name: "Activities", href: "/activities", icon: Trophy },
    { name: "Studying", href: "/studying", icon: Brain },
    { name: "Settings", href: "/settings", icon: Settings },
];
