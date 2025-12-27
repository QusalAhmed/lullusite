import { headers } from "next/headers";
import { cookies } from "next/headers";

export type RequestSource = {
    origin?: string;
    host?: string;
    protocol?: string;
    referer?: string;
    url?: string; // Built as protocol + host
    userAgent?: string;
    ipAddress?: string;
    fbp?: string;
    fbc?: string;
};

/**
 * Extracts request origin info in a server action/route using Next.js headers().
 * Works behind proxies (Vercel) using x-forwarded-proto and host.
 */
export async function getRequestSource(): Promise<RequestSource> {
    const headersList = await headers();
    const cookieStore = await cookies();

    const origin = headersList.get("origin") ?? undefined;
    const referer = headersList.get("referer") ?? undefined;
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? undefined;
    const protocol = headersList.get("x-forwarded-proto") ?? (origin?.startsWith("https") ? "https" : "http");
    const url = host ? `${protocol}://${host}` : origin ?? undefined;
    const userAgent = headersList.get("user-agent") ?? undefined;
    const ipAddress = getClientIpAddress(headersList);
    const fbp = cookieStore.get("_fbp")?.value;
    const fbc = cookieStore.get("_fbc")?.value;

    return {origin, host, protocol, referer, url, userAgent, ipAddress, fbp, fbc};
}

/**
 * Extracts the client IP address from request headers.
 * Handles multiple proxy scenarios (Vercel, Cloudflare, AWS ALB, etc).
 * Priority order: x-client-ip > x-forwarded-for > cf-connecting-ip > x-real-ip > x-forwarded > forwarded
 */
function getClientIpAddress(headersList: Awaited<ReturnType<typeof headers>>): string | undefined {
    // Try x-client-ip first (some proxies use this)
    const clientIp = headersList.get("x-client-ip");
    if (clientIp) return clientIp;

    // Try x-forwarded-for (most common, can have multiple IPs - take first one)
    const xForwardedFor = headersList.get("x-forwarded-for");
    if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map(ip => ip.trim());
        return ips[0];
    }

    // Cloudflare
    const cfConnectingIp = headersList.get("cf-connecting-ip");
    if (cfConnectingIp) return cfConnectingIp;

    // Nginx and Apache
    const xRealIp = headersList.get("x-real-ip");
    if (xRealIp) return xRealIp;

    // AWS ALB / CloudFront
    const xForwarded = headersList.get("x-forwarded");
    if (xForwarded) return xForwarded;

    // Standard forwarded header (RFC 7239)
    const forwarded = headersList.get("forwarded");
    if (forwarded) {
        const match = forwarded.match(/for=([^;,\]]+)/);
        if (match) {
            let ip = match[1];
            // Remove IPv6 brackets if present
            ip = ip.replace(/^\[/, "").replace(/].*$/, "");
            return ip;
        }
    }

    return undefined;
}
