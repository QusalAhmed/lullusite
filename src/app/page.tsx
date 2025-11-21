import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lullu — Website Builder & Business Automation',
    description: 'Build fast, beautiful websites and automate workflows — all in one platform. Launch sites, manage products, payments and marketing with Lullu.',
};

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/animations/reveal"

export default function Home() {
    // navigation items for the site header
    const navigation = [
        { title: "Features", path: "/#features" },
        { title: "Pricing", path: "/#pricing" },
        { title: "Customers", path: "/customers" },
        { title: "Blog", path: "/blog" },
        { title: "Docs", path: "/docs" },
    ];

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen">
            <header>
                <nav className="items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
                    <div className="flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center">
                            <Image src='/home/logo.png' width={140} height={50} alt="Lullu logo" />
                        </Link>
                        <div className="hidden sm:flex sm:items-center sm:space-x-6">
                            {navigation.map((item, idx) => (
                                <Link key={idx} href={item.path} className="text-gray-300 hover:text-white">
                                    {item.title}
                                </Link>
                            ))}
                            <Link href="/auth/sign-in" className="flex items-center text-gray-200 border border-transparent hover:border-gray-700 px-3 py-2 rounded">
                                Log in
                            </Link>
                            <Link href="/auth/sign-up" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white font-medium">
                                Get started
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <section className="mt-10 mx-auto max-w-screen-xl pb-12 px-4 lg:flex md:px-8 items-center">
                <div className="space-y-6 flex-1 sm:text-center lg:text-left">
                    <Reveal>
                        <h1 className="text-white font-extrabold text-4xl sm:text-5xl leading-tight">
                            Build amazing websites. Automate your business.
                        </h1>
                    </Reveal>
                    <p className="text-gray-300 max-w-2xl leading-relaxed">
                        Lullu is a website builder and business automation platform for agencies and creators. Launch fast, accept
                        payments, run marketing automations and manage products — without writing infrastructure code.
                    </p>
                    <div className="pt-6 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
                        <Reveal>
                            <Link href="/merchant/dashboard" className="px-7 py-3 bg-white text-gray-900 rounded-md shadow-md inline-block text-center">
                                Try Lullu — free
                            </Link>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <Link href="/auth/sign-up" className="px-7 py-3 bg-gray-700 text-gray-200 rounded-md inline-block text-center border border-gray-700">
                                Talk to sales
                            </Link>
                        </Reveal>
                    </div>
                    <div className="mt-6 text-sm text-gray-400">
                        Trusted by teams at <span className="text-white font-medium">50,000+</span> sites and growing.
                    </div>
                </div>
                <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-6">
                    <Image src="/home/undraw-heatmap-uyye.png" className="w-full mx-auto sm:w-10/12 lg:w-full rounded" alt="illustration" width={560} height={420} />
                </div>
            </section>

            {/* Features */}
            <section id="features" className="bg-gray-800 py-16">
                <div className="max-w-screen-xl mx-auto px-4">
                    <h2 className="text-center text-3xl font-bold text-white">Everything you need to build and grow</h2>
                    <p className="text-center text-gray-300 mt-3 max-w-2xl mx-auto">Pages, e-commerce, automations, analytics and integrations — designed for speed and simplicity.</p>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-900 p-5 rounded-lg">
                            <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v3h6v-3c0-1.657-1.343-3-3-3z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mt-4">Drag & drop site builder</h3>
                            <p className="text-gray-400 mt-2 text-sm">Design responsive pages with an intuitive editor — no code required.</p>
                        </div>

                        <div className="bg-gray-900 p-5 rounded-lg">
                            <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mt-4">E‑commerce & payments</h3>
                            <p className="text-gray-400 mt-2 text-sm">Sell products, manage inventory and accept payments with built‑in checkout.</p>
                        </div>

                        <div className="bg-gray-900 p-5 rounded-lg">
                            <div className="w-12 h-12 bg-yellow-600 rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a4 4 0 018 0v6" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mt-4">Automations</h3>
                            <p className="text-gray-400 mt-2 text-sm">Trigger emails, webhooks and workflows to automate repetitive tasks.</p>
                        </div>

                        <div className="bg-gray-900 p-5 rounded-lg">
                            <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mt-4">Analytics & SEO</h3>
                            <p className="text-gray-400 mt-2 text-sm">Understand visitors, optimize pages and track conversions with built‑in analytics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology */}
            <section id="technology" className="py-16 bg-gray-900">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white">Built on modern technologies</h2>
                    <p className="text-gray-300 mt-3 max-w-2xl mx-auto">We use a modern, reliable stack so you can move fast and scale securely.</p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4z" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Next.js</div>
                                    <div className="text-sm text-gray-400">Blazing-fast server-rendered React framework for production.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sky-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">React + TypeScript</div>
                                    <div className="text-sm text-gray-400">Component-driven UI with strong typing for safer code.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Tailwind CSS</div>
                                    <div className="text-sm text-gray-400">Utility-first styling for fast, consistent UIs.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5z" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Drizzle ORM</div>
                                    <div className="text-sm text-gray-400">Type-safe database queries and migrations for predictable data access.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">PostgreSQL</div>
                                    <div className="text-sm text-gray-400">Reliable relational database for your data and analytics.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Stripe</div>
                                    <div className="text-sm text-gray-400">Secure payments and billing with a flexible API.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-600 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Vercel</div>
                                    <div className="text-sm text-gray-400">Instant global deployments and edge infrastructure.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14" strokeWidth="0"/></svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Open integrations</div>
                                    <div className="text-sm text-gray-400">Connect marketing, analytics and billing tools via webhooks and APIs.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-16">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white">Simple pricing for teams of all sizes</h2>
                    <p className="text-gray-300 mt-2 max-w-2xl mx-auto">Pay monthly or annually. Start free — upgrade when you&#39;re ready.</p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold">Starter</h3>
                            <div className="mt-4 text-3xl font-bold">Free</div>
                            <p className="text-gray-400 mt-2">Perfect for personal sites and prototypes.</p>
                            <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left">
                                <li>Up to 3 pages</li>
                                <li>Basic analytics</li>
                                <li>Community support</li>
                            </ul>
                            <div className="mt-6">
                                <Link href="/auth/sign-up" className="px-4 py-2 bg-indigo-600 rounded text-white inline-block">Create free site</Link>
                            </div>
                        </div>

                        <div className="bg-indigo-600 rounded-lg p-6 shadow-lg">
                            <h3 className="text-xl font-semibold">Pro</h3>
                            <div className="mt-4 text-3xl font-bold">$29<span className="text-sm font-normal">/mo</span></div>
                            <p className="text-indigo-100 mt-2">For growing teams and stores.</p>
                            <ul className="text-indigo-50 mt-4 space-y-2 text-sm text-left">
                                <li>Unlimited pages</li>
                                <li>E‑commerce features</li>
                                <li>Priority support</li>
                            </ul>
                            <div className="mt-6">
                                <Link href="/auth/sign-up" className="px-4 py-2 bg-white text-indigo-700 rounded inline-block font-medium">Start free trial</Link>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold">Enterprise</h3>
                            <div className="mt-4 text-3xl font-bold">Custom</div>
                            <p className="text-gray-400 mt-2">For scale and custom integrations.</p>
                            <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left">
                                <li>Custom SLAs</li>
                                <li>Single sign-on</li>
                                <li>Dedicated support</li>
                            </ul>
                            <div className="mt-6">
                                <Link href="/" className="px-4 py-2 bg-indigo-600 rounded text-white inline-block">Contact sales</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gray-800 py-16">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white">Loved by teams around the world</h2>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <p className="text-gray-300">&#34;Lullu cut our launch time in half. The automations and built-in payments saved us weeks of engineering work.&#34;</p>
                            <div className="mt-4 flex items-center justify-center">
                                <Image src="/home/logo.png" alt="company" width={48} height={24} />
                                <div className="ml-3 text-left">
                                    <div className="font-semibold">Acme Agency</div>
                                    <div className="text-sm text-gray-400">Design lead</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <p className="text-gray-300">&#34;We were able to replace several tools with one platform — and our conversion rates improved.&#34;</p>
                            <div className="mt-4 flex items-center justify-center">
                                <Image src="/home/logo.png" alt="company" width={48} height={24} />
                                <div className="ml-3 text-left">
                                    <div className="font-semibold">BrightStore</div>
                                    <div className="text-sm text-gray-400">Founder</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <p className="text-gray-300">&#34;The built-in analytics helped us focus our marketing spend where it works best.&#34;</p>
                            <div className="mt-4 flex items-center justify-center">
                                <Image src="/home/logo.png" alt="company" width={48} height={24} />
                                <div className="ml-3 text-left">
                                    <div className="font-semibold">Marketly</div>
                                    <div className="text-sm text-gray-400">Growth</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter + Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center">
                            <Image src="/home/logo.png" alt="Lullu" width={140} height={50} />
                            <span className="ml-3 font-semibold text-white">Lullu</span>
                        </div>
                        <p className="mt-4 text-sm text-gray-400 max-w-xs">Make beautiful websites, manage products and automate business processes — all in one place.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">Resources</h4>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white">Docs</Link></li>
                            <li><Link href="/store" className="hover:text-white">Blog</Link></li>
                            <li><Link href="/" className="hover:text-white">Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">Get updates</h4>
                        <p className="text-sm text-gray-400 mt-2">Join our newsletter for product updates and tips.</p>
                        <form className="mt-4 flex">
                            <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded-l bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-indigo-500" />
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 text-sm">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                        <div>© {new Date().getFullYear()} Lullu — All rights reserved.</div>
                        <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                            <Link href="/" className="hover:text-white">Terms</Link>
                            <Link href="/" className="hover:text-white">Privacy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
