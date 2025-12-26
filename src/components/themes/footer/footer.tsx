import React from 'react'
import Link from "next/link";
import Image from "next/image";

// Actions
import getBusinessInfo from "@/actions/store/get-business-info";

// Icons
import { FaFacebook, FaWhatsapp, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

// Footer Component
import MadeWith from "./made-with";

const Footer = async ({storeSlug}: { storeSlug: string }) => {
    const data = await getBusinessInfo();
    const year = new Date().getFullYear();

    const logoSrc = data?.logoImage?.thumbnailUrl;
    const logoAlt = data?.logoImage?.altText || data?.businessName || "Store Logo";

    const quickLinks = [
        {label: "Home", href: `/store/${storeSlug}`},
        {label: "Cart", href: `/store/${storeSlug}/cart`},
        {label: "Account", href: `/store/${storeSlug}/profile`},
    ];

    const contactItems = [
        data?.address && {icon: MapPin, label: data.address},
        data?.phone && {icon: Phone, label: data.phone, href: `tel:${data.phone}`},
        data?.email && {icon: Mail, label: data.email, href: `mailto:${data.email}`},
    ].filter(Boolean) as { icon: typeof MapPin; label: string; href?: string }[];

    // NOTE: business info schema currently doesn't include socials.
    // These are safe defaults – once you add fields like facebookUrl/instagramUrl, swap the href values.
    const socialLinks: Array<{
        label: string;
        href?: string;
        Icon: React.ComponentType<{ className?: string }>;
        hoverClass: string
    }> = [
        {
            label: 'Facebook',
            href: undefined,
            Icon: FaFacebook,
            hoverClass: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40'
        },
        {
            label: 'WhatsApp',
            href: undefined,
            Icon: FaWhatsapp,
            hoverClass: 'hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40'
        },
        {
            label: 'Instagram',
            href: undefined,
            Icon: FaInstagram,
            hoverClass: 'hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/40'
        },
        {
            label: 'YouTube',
            href: undefined,
            Icon: FaYoutube,
            hoverClass: 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40'
        },
        {
            label: 'TikTok',
            href: undefined,
            Icon: FaTiktok,
            hoverClass: 'hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900/40 dark:hover:text-slate-50'
        },
    ];

    const hasSocials = socialLinks.some(s => !!s.href);

    return (
        <footer className="mt-10 border-t border-border/50 bg-background/60">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row justify-between md:py-12">
                <div className="flex flex-col gap-4 md:max-w-md">
                    <div className="flex items-center gap-3">
                        {logoSrc ? (
                            <Image
                                src={logoSrc}
                                alt={logoAlt}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded bg-white object-contain p-1"
                            />
                        ) : (
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded bg-muted text-lg font-semibold">
                                {data?.businessName?.[0] || "X"}
                            </div>
                        )}
                        <div>
                            <p className="text-lg font-semibold whitespace-nowrap">
                                {data?.businessName || "Your Store"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {data?.description || "Quality products and great service."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 text-sm sm:grid-cols-2 md:grid-cols-3">
                    <div className="space-y-3">
                        <p className="text-base font-semibold">Quick Links</p>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            {quickLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="transition hover:text-foreground">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-base font-semibold">Contact</p>
                        <div className="flex flex-col gap-3 text-muted-foreground">
                            {contactItems.length > 0 ? contactItems.map(({icon: Icon, label, href}) => (
                                href ? (
                                    <Link key={label} href={href}
                                          className="flex items-center gap-2 transition hover:text-foreground">
                                        <Icon size={18}/>
                                        <span>{label}</span>
                                    </Link>
                                ) : (
                                    <div key={label} className="flex items-center gap-2">
                                        <Icon size={18}/>
                                        <span>{label}</span>
                                    </div>
                                )
                            )) : (
                                <p className="text-muted-foreground">Contact details coming soon.</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <p className="text-sm font-medium text-foreground/90">Follow us</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {socialLinks.map(({label, href, Icon, hoverClass}) => {
                                    const baseClass = `inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition ${hoverClass} focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background`;

                                    // If merchant has no link configured yet, render disabled button style.
                                    if (!href) {
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                aria-label={`${label} (not configured)`}
                                                title={`${label} link not configured`}
                                                className={`${baseClass} cursor-not-allowed opacity-50`}
                                                disabled
                                            >
                                                <Icon className="h-5 w-5"/>
                                            </button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            className={baseClass}
                                        >
                                            <Icon className="h-5 w-5"/>
                                        </Link>
                                    );
                                })}
                            </div>

                            {!hasSocials && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Social links will appear here once configured.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-base font-semibold">Store</p>
                        <div className="text-muted-foreground">
                            <p className="flex items-center gap-2"><MapPin size={18}/>{data?.address || "Address not provided"}</p>
                            <p className="mt-2 text-sm">We are committed to delivering an excellent shopping experience.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-border/30 bg-background/80">
                <div
                    className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row">
                    <span>© {year} {data?.businessName || "Store"}. All rights reserved.</span>
                    <div className="flex gap-4">
                        <Link href={`/store/${storeSlug}`}>Return to store</Link>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                    </div>
                </div>
            </div>
            <MadeWith/>
        </footer>
    );
};

export default Footer;