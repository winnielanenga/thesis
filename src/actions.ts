"use server";

import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginWithGoogle() {
    try {
        await signIn("google", { redirectTo: "/dashboard" });
    } catch (error) {
        if (isRedirectError(error)) {
            throw error; // Re-throw redirect errors so Next.js can handle the redirect
        }
        console.error("Server Action Login Error:", error);
        throw error;
    }
}
