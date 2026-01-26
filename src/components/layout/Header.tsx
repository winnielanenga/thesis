
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ graduationYear }: { graduationYear?: number }) {
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, text: "Welcome to V3.0!", time: "Just now", unread: true },
        { id: 2, text: "Don't forget to sync your roadmap.", time: "1h ago", unread: true },
        { id: 3, text: "New seasonal milestones available.", time: "2h ago", unread: false },
    ];

    return (
        <header className="h-16 border-b bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
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
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-black"></span>
                </Button>

                {showNotifications && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowNotifications(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((n) => (
                                    <div key={n.id} className={cn("p-4 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer", n.unread && "bg-indigo-50/50 dark:bg-indigo-900/10")}>
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-sm font-medium leading-none">{n.text}</p>
                                            {n.unread && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1.5">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t bg-slate-50 dark:bg-slate-800/50 text-center">
                                <Button variant="ghost" size="sm" className="w-full text-xs h-8">Mark all as read</Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
