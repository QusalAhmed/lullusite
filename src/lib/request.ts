import { headers } from "next/headers";

export type RequestSource = {
    origin?: string;
    host?: string;
    protocol?: string;
    referer?: string;
    url?: string; // Built as protocol + host
    userAgent?: string;
};

/**
 * Extracts request origin info in a server action/route using Next.js headers().
 * Works behind proxies (Vercel) using x-forwarded-proto and host.
 */
export async function getRequestSource(): Promise<RequestSource> {
    const headersList = await headers();

    const origin = headersList.get("origin") ?? undefined;
    const referer = headersList.get("referer") ?? undefined;
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? undefined;
    const protocol = headersList.get("x-forwarded-proto") ?? (origin?.startsWith("https") ? "https" : "http");
    const url = host ? `${protocol}://${host}` : origin ?? undefined;
    const userAgent = headersList.get("user-agent") ?? undefined;

    return {origin, host, protocol, referer, url, userAgent};
}
