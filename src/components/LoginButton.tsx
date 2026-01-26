
"use client";


import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginWithGoogle } from "@/actions";

import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            size="lg"
            className="h-12 px-8 text-base rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    Get Started with Google <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export function LoginButton() {
    return (
        <form action={loginWithGoogle}>
            <SubmitButton />
        </form>
    );
}
