import { NextResponse, NextRequest } from 'next/server'
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        const userNext = encodeURIComponent(request.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/auth/sign-in?next=${userNext}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/merchant/:path*'],
}