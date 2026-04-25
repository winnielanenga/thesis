

import { LoginButton } from "@/components/LoginButton";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-background to-muted overflow-hidden relative">

      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/15 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse animation-delay-2000" />

      <main className="z-10 text-center space-y-8 p-8 max-w-2xl">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Version 3.0 Now Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold pb-2">
            Plan Your Future.
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The all-in-one workspace for high school success. Track grades, manage tasks, and build your college roadmap.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-8 text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div>
            <div className="font-bold text-2xl text-foreground mb-1">4.0</div>
            <div>GPA Goal</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-foreground mb-1">4yr</div>
            <div>Roadmap</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-foreground mb-1">10+</div>
            <div>Career Paths</div>
          </div>
        </div>
      </main>
    </div>
  );
}
