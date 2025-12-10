import React from 'react';
import Link from 'next/link';

const StorePage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-linear-to-r from-primary/10 to-primary/5 py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to Our Store
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Discover amazing products at great prices. Quality items curated just for you.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="#"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="#"
                            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
                        >
                            Browse Categories
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food'].map((category) => (
                            <Link
                                key={category}
                                href={`/src/lib/redux/store.ts/category/${category.toLowerCase()}`}
                                className="group"
                            >
                                <div className="rounded-lg border bg-card p-8 text-center hover:shadow-lg transition-all hover:scale-105">
                                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold">{category}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section id="featured" className="py-16 px-4 bg-muted/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-square bg-muted flex items-center justify-center">
                                    <svg className="h-20 w-20 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold mb-2">Product Name {i}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        High quality product description goes here
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">$99.99</span>
                                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-lg bg-linear-to-r from-primary to-primary/80 text-primary-foreground p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Special Offer!</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Get 20% off on your first order. Use code: WELCOME20
                        </p>
                        <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 px-4 border-t">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-muted-foreground mb-6">
                        Subscribe to our newsletter for exclusive deals and updates
                    </p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StorePage;