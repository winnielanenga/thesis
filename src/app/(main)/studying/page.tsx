
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Brain, FileText, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyingPage() {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                        Studying
                    </h1>
                    <p className="text-muted-foreground">Master your learning with proven techniques.</p>
                </div>

                {/* Timer Control */}
                {!isTimerRunning ? (
                    <Button onClick={() => setIsTimerRunning(true)} className="gap-2 rounded-full shadow-lg shadow-primary/20">
                        <Clock className="h-4 w-4" /> Start Study Timer
                    </Button>
                ) : (
                    <Button
                        variant="destructive"
                        onClick={() => { setIsTimerRunning(false); setElapsedSeconds(0); }}
                        className="gap-2 rounded-full shadow-lg shadow-red-500/20"
                    >
                        <Clock className="h-4 w-4" /> Stop Session
                    </Button>
                )}
            </div>

            {/* Active Session Banner */}
            <AnimatePresence>
                {isTimerRunning && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full bg-white/50 border border-border rounded-2xl p-6 flex items-center justify-between shadow-lg backdrop-blur-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center animate-pulse">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div>
                                <div className="font-bold text-xl text-foreground">Session in Progress</div>
                                <div className="text-sm text-muted-foreground">Stay focused! You got this.</div>
                            </div>
                        </div>
                        <div className="font-mono text-5xl font-bold tracking-wider tabular-nums text-foreground/80">
                            {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:
                            {(elapsedSeconds % 60).toString().padStart(2, '0')}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Section title="Note Taking Techniques" icon={FileText}>
                <MethodCard
                    title="Cornell Notes"
                    tagLine="Best for: Live Lectures & Textbook Summary"
                    description="Divide your paper into 3 sections: Cues (left), Notes (right), and Summary (bottom). Creates an efficient study guide."
                    time="During class + 15m review"
                    pairsWith="Blurting"
                    color="bg-blue-50/50 border-blue-100"
                />
                <MethodCard
                    title="Outline Method"
                    tagLine="Best for: Structured Science/History"
                    description="Organize notes in a structured hierarchy (Main Topic -> Subtopic -> Detail). Shows connections at a glance."
                    time="Real-time"
                    pairsWith="Flashcards"
                    color="bg-cyan-50/50 border-cyan-100"
                />
                <MethodCard
                    title="Mind Mapping"
                    tagLine="Best for: Brainstorming & Connections"
                    description="Visual diagram starting with a central concept and branching out. Great for visual learners."
                    time="20-30 mins"
                    pairsWith="Blurting"
                    color="bg-teal-50/50 border-teal-100"
                />
            </Section>

            <Section title="Active Learning Methods" icon={Brain}>
                <MethodCard
                    title="Blurting (Active Recall)"
                    tagLine="Best for: Testing Memory"
                    description="Read a section, close notes, write down EVERYTHING you remember. Check against notes and fill in gaps in red."
                    time="15-20 min blocks"
                    pairsWith="Mind Maps"
                    color="bg-rose-50/50 border-rose-100"
                />
                <MethodCard
                    title="Leitner System"
                    tagLine="Best for: Spaced Repetition"
                    description="Use 3 boxes for flashcards. Correct? Move up. Wrong? Move back to Box 1. Reviews become less frequent as you master them."
                    time="Daily Review"
                    pairsWith="Flashcards"
                    color="bg-orange-50/50 border-orange-100"
                />
                <MethodCard
                    title="Feynman Technique"
                    tagLine="Best for: Deep Understanding"
                    description="Explain a concept simply as if teaching a 5-year-old. Identify gaps where you get stuck context."
                    time="As needed"
                    pairsWith="Cornell Notes"
                    color="bg-amber-50/50 border-amber-100"
                />
                <MethodCard
                    title="20-5-5 Method"
                    tagLine="Best for: Focus & Retention"
                    description="20 mins intense study, 5 mins break, 5 mins review. Keeps the brain fresh and reinforces memory immediately."
                    time="30 min cycles"
                    pairsWith="Timer"
                    color="bg-yellow-50/50 border-yellow-100"
                />
            </Section>
        </div>
    );
}

function Section({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-xl font-bold text-foreground/80">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                {title}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </div>
    )
}

function MethodCard({ title, tagLine, description, time, pairsWith, color }: any) {
    return (
        <Card className={`glass-card border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${color}`}>
            <CardContent className="p-6 space-y-4 h-full flex flex-col">
                <div>
                    <h3 className="text-xl font-bold mb-1">{title}</h3>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-80">{tagLine}</p>
                </div>

                <div className="bg-white/60 p-4 rounded-xl text-sm leading-relaxed backdrop-blur-sm flex-1">
                    <span className="font-semibold text-foreground/90">How to: </span>
                    {description}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-black/5 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 opacity-70" />
                        {time}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 opacity-70" />
                        Pairs {pairsWith}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
