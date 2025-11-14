import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    const navigation = [
        {title: "Features", path: "#features"},
        {title: "How It Works", path: "#how-it-works"},
        {title: "Testimonials", path: "#testimonials"},
    ]

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
            ),
            title: "Easy Website Builder",
            desc: "Create stunning websites without coding. Drag and drop your way to a professional online presence."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            ),
            title: "Business Automation",
            desc: "Automate your business processes, from inventory management to customer communications."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
            ),
            title: "E-Commerce Ready",
            desc: "Start selling online immediately with our integrated e-commerce platform and secure payment processing."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
            ),
            title: "Mobile Responsive",
            desc: "Your website looks perfect on every device - desktop, tablet, and mobile."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            ),
            title: "Analytics & Insights",
            desc: "Track your website performance and business metrics with built-in analytics."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            title: "Secure & Reliable",
            desc: "Enterprise-grade security and 99.9% uptime guarantee for your peace of mind."
        }
    ]

    const steps = [
        {
            title: "Sign Up",
            desc: "Create your free account in seconds. No credit card required to get started."
        },
        {
            title: "Choose a Template",
            desc: "Select from our professionally designed templates or start from scratch."
        },
        {
            title: "Customize Your Site",
            desc: "Use our intuitive drag-and-drop builder to make your website unique."
        },
        {
            title: "Launch & Grow",
            desc: "Publish your website and watch your business grow with built-in tools."
        }
    ]

    const testimonials = [
        {
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            name: "Sarah Johnson",
            title: "Small Business Owner",
            quote: "Lullu Site transformed my business. I built a professional website in hours, not weeks. The automation features have saved me countless hours!"
        },
        {
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
            name: "Michael Chen",
            title: "Freelance Designer",
            quote: "As a designer, I appreciate the flexibility and control. The platform is powerful yet intuitive. My clients love their new websites!"
        },
        {
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            name: "Emma Rodriguez",
            title: "Restaurant Owner",
            quote: "The e-commerce features helped me take my restaurant online. Online orders increased by 300% in the first month!"
        }
    ]

    return (
        <div className="bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
                <nav className="items-center pt-5 pb-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
                    <Link href="/">
                        <Image
                            src='/home/logo.png'
                            width={120}
                            height={50}
                            alt="Lullu Site Logo"
                        />
                    </Link>
                    <ul className="py-4 flex-1 items-center flex space-x-3 sm:space-x-6 sm:justify-end">
                        {
                            navigation.map((item, idx) => (
                                <li className="text-gray-200 hover:text-indigo-400 transition-colors" key={idx}>
                                    <a href={item.path}>{item.title}</a>
                                </li>
                            ))
                        }
                        <li>
                            <Link href="/auth/sign-in" className="flex items-center text-gray-200 hover:text-indigo-400 transition-colors">
                                Log In
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                          clipRule="evenodd"/>
                                </svg>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="mt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8">
                <div className="space-y-4 flex-1 sm:text-center lg:text-left">
                    <h1 className="text-white font-bold text-4xl xl:text-6xl">
                        Build Your Business,
                        <span className="text-indigo-400"> Automate Your Success</span>
                    </h1>
                    <p className="text-gray-300 max-w-xl text-lg leading-relaxed sm:mx-auto lg:ml-0">
                        Create stunning websites and automate your business processes with Lullu Site. 
                        No coding required - just your vision and our powerful platform.
                    </p>
                    <div className="pt-10 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
                        <Link href="/auth/sign-up"
                           className="px-7 py-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-md shadow-md block sm:w-auto transition-colors">
                            Get Started Free
                        </Link>
                        <Link href="/merchant/dashboard"
                           className="px-7 py-3 w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-center rounded-md block sm:w-auto transition-colors">
                            View Demo
                        </Link>
                    </div>
                    <p className="text-gray-400 text-sm">✨ No credit card required • Free 14-day trial</p>
                </div>
                <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
                    <Image src="/home/undraw-heatmap-uyye.png"
                           className="w-full mx-auto sm:w-10/12 lg:w-full"
                           alt="Business illustration" width={500} height={500}
                    />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-800/50">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-white text-3xl font-bold sm:text-4xl">
                            Everything You Need to Succeed
                        </h2>
                        <p className="mt-3 text-gray-300">
                            Powerful features designed to help your business grow and thrive online.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((item, idx) => (
                            <div key={idx} className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-gray-300">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-white text-3xl font-bold sm:text-4xl">
                            How It Works
                        </h2>
                        <p className="mt-3 text-gray-300">
                            Get your business online in four simple steps
                        </p>
                    </div>
                    <div className="mt-12 max-w-4xl mx-auto">
                        {steps.map((item, idx) => (
                            <div key={idx} className="flex gap-x-6 mb-10 last:mb-0">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {idx + 1}
                                    </div>
                                    {idx !== steps.length - 1 && (
                                        <div className="w-0.5 h-20 bg-gray-700 mt-2"></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-300">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-800/50">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-white text-3xl font-bold sm:text-4xl">
                            Loved by Businesses Worldwide
                        </h2>
                        <p className="mt-3 text-gray-300">
                            See what our customers have to say about their experience
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {testimonials.map((item, idx) => (
                            <div key={idx} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <Image 
                                        src={item.avatar}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h4 className="text-white font-semibold">{item.name}</h4>
                                        <p className="text-gray-400 text-sm">{item.title}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">&quot;{item.quote}&quot;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-white text-3xl font-bold sm:text-4xl mb-4">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of successful businesses using Lullu Site to grow their online presence.
                            Start your free trial today - no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/sign-up"
                               className="px-8 py-4 bg-white text-indigo-600 font-semibold text-center rounded-md shadow-lg hover:bg-gray-100 transition-colors">
                                Start Free Trial
                            </Link>
                            <Link href="/store"
                               className="px-8 py-4 bg-indigo-700 text-white font-semibold text-center rounded-md shadow-lg hover:bg-indigo-800 transition-colors">
                                Explore Stores
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-gray-800">
                <div className="max-w-screen-xl mx-auto px-4 py-12 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="#features" className="text-gray-400 hover:text-indigo-400 transition-colors">Features</Link></li>
                                <li><Link href="/merchant/dashboard" className="text-gray-400 hover:text-indigo-400 transition-colors">Dashboard</Link></li>
                                <li><Link href="/store" className="text-gray-400 hover:text-indigo-400 transition-colors">Stores</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Support</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <Image
                                src='/home/logo.png'
                                width={100}
                                height={40}
                                alt="Lullu Site Logo"
                            />
                        </div>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Lullu Site. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
