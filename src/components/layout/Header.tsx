
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
    id: string;
    text: string;
    detail: string;
    type: 'milestone' | 'task';
};

interface HeaderProps {
    graduationYear?: number;
    notifications?: Notification[];
}

export function Header({ graduationYear, notifications = [] }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const activeNotifications = notifications.filter(n => !dismissed.has(n.id));
    const unreadCount = activeNotifications.length;

    const handleDismissAll = () => {
        setDismissed(new Set(notifications.map(n => n.id)));
        setShowNotifications(false);
    };

    return (
        <header className="h-16 border-b bg-white/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
            <div className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span>
                Class of {graduationYear || '...'}
            </div>

            <div className="flex items-center gap-4 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setShowNotifications(!showNotifications)}
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
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                                            className="p-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer bg-purple-50/30"
                                            onClick={() => setDismissed(prev => new Set([...prev, n.id]))}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "mt-0.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                                                    n.type === 'milestone'
                                                        ? "bg-purple-100 text-purple-600"
                                                        : "bg-amber-100 text-amber-600"
                                                )}>
                                                    {n.type === 'milestone'
                                                        ? <ClipboardList className="h-3.5 w-3.5" />
                                                        : <Calendar className="h-3.5 w-3.5" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium leading-tight">{n.text}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{n.detail}</p>
                                                </div>
                                                <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
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
    );
}
