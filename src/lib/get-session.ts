'use server'

import { headers } from "next/headers"

// Auth
import { auth } from "@/lib/auth"

export default async function getSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("No session found");
    }

    return session;
}