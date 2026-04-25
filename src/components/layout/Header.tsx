
"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, ClipboardList, FileText, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";

type Notification = {
    id: string;
    text: string;
    detail: string;
    type: 'milestone' | 'task' | 'essay';
};

interface HeaderProps {
    graduationYear?: number;
    notifications?: Notification[];
    userName?: string | null;
    userEmail?: string | null;
}

export function Header({ graduationYear, notifications = [], userName, userEmail }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const activeNotifications = notifications.filter(n => !dismissed.has(n.id));
    const unreadCount = activeNotifications.length;
    const userInitial = userName?.[0] ?? '?';

    const handleDismissAll = () => {
        setDismissed(new Set(notifications.map(n => n.id)));
        setShowNotifications(false);
    };

    return (
        <>
            <header className="h-16 border-b bg-white/50 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
                {/* Left: hamburger (mobile) + label */}
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden -ml-2"
                        onClick={() => setShowMobileNav(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="md:hidden font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        ThesisPrep
                    </span>
                    <div className="hidden md:flex font-semibold text-sm text-muted-foreground items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span>
                        Class of {graduationYear || '...'}
                    </div>
                </div>

                {/* Right: notifications */}
                <div className="flex items-center gap-4 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>

                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] max-w-80 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                                    <h3 className="font-semibold text-sm">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto">
                                    {activeNotifications.length > 0 ? (
                                        activeNotifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className="p-4 border-b last:border-0 hover:bg-muted transition-colors cursor-pointer bg-primary/5"
                                                onClick={() => setDismissed(prev => new Set([...prev, n.id]))}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "mt-0.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                                                        n.type === 'milestone'
                                                            ? "bg-primary/10 text-primary"
                                                            : n.type === 'essay'
                                                                ? "bg-violet-100 text-violet-600"
                                                                : "bg-amber-100 text-amber-600"
                                                    )}>
                                                        {n.type === 'milestone'
                                                            ? <ClipboardList className="h-3.5 w-3.5" />
                                                            : n.type === 'essay'
                                                                ? <FileText className="h-3.5 w-3.5" />
                                                                : <Calendar className="h-3.5 w-3.5" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium leading-tight">{n.text}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{n.detail}</p>
                                                    </div>
                                                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">All caught up!</p>
                                        </div>
                                    )}
                                </div>
                                {activeNotifications.length > 0 && (
                                    <div className="p-2 border-t bg-slate-50 text-center">
                                        <Button variant="ghost" size="sm" className="w-full text-xs h-8" onClick={handleDismissAll}>
                                            Dismiss all
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Mobile nav drawer */}
            {showMobileNav && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 animate-in fade-in"
                        onClick={() => setShowMobileNav(false)}
                    />
                    {/* Drawer */}
                    <div className="relative w-72 max-w-[85vw] bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
                        <div className="p-5 flex items-center justify-between border-b">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                                ThesisPrep
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMobileNav(false)}
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setShowMobileNav(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary transition-all"
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="m-3 p-4 rounded-xl bg-muted/50 border-t border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                                    {userInitial}
                                </div>
                                <div className="overflow-hidden flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate">{userName}</div>
                                    <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                    setShowMobileNav(false);
                                    signOut();
                                }}
                            >
                                <LogOut className="h-4 w-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
