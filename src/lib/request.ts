import { headers } from "next/headers";

export type RequestSource = {
  origin?: string;
  host?: string;
  protocol?: string;
  referer?: string;
  url?: string; // Built as protocol + host
};

/**
 * Extracts request origin info in a server action/route using Next.js headers().
 * Works behind proxies (Vercel) using x-forwarded-proto and host.
 */
export async function getRequestSource(): Promise<RequestSource> {
  const hdrs = await headers();

  const origin = hdrs.get("origin") ?? undefined;
  const referer = hdrs.get("referer") ?? undefined;
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? undefined;
  const protocol = hdrs.get("x-forwarded-proto") ?? (origin?.startsWith("https") ? "https" : "http");

  const url = host ? `${protocol}://${host}` : origin ?? undefined;

  return { origin, host, protocol, referer, url };
}
