import React from 'react';

const PublicStore = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Store Header/Banner */}
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-start gap-6">
                        {/* Store Logo */}
                        <div className="h-32 w-32 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
                            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>

                        {/* Store Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2">Store Name</h1>
                            <p className="text-white/90 text-lg mb-4">
                                Welcome to our official store. Discover quality products at great prices.
                            </p>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>4.8 (2,345 reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span>1,234 Products</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>10K+ Customers</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                Follow Store
                            </button>
                            <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="sticky top-4 space-y-6">
                            {/* Categories */}
                            <div className="rounded-lg border bg-card p-4">
                                <h3 className="font-semibold mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {['All Products', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'].map((category) => (
                                        <button
                                            key={category}
                                            className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="rounded-lg border bg-card p-4">
                                <h3 className="font-semibold mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    {['Under $25', '$25 - $50', '$50 - $100', '$100 - $200', 'Over $200'].map((range) => (
                                        <label key={range} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="rounded" />
                                            <span>{range}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="rounded-lg border bg-card p-4">
                                <h3 className="font-semibold mb-3">Rating</h3>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="rounded" />
                                            <div className="flex items-center gap-1">
                                                {Array.from({length: rating}).map((_, i) => (
                                                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="ml-1">& up</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-muted-foreground">
                                Showing 1-24 of 1,234 products
                            </div>
                            <div className="flex items-center gap-4">
                                <select className="px-4 py-2 rounded-md border border-border bg-background">
                                    <option>Best Match</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest</option>
                                    <option>Best Selling</option>
                                </select>
                                <div className="flex gap-1">
                                    <button className="p-2 rounded-md border hover:bg-accent">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 rounded-md border hover:bg-accent">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({length: 12}).map((_, i) => (
                                <div key={i} className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow group">
                                    <div className="aspect-square bg-muted relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="h-20 w-20 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        {/* Quick view on hover */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="px-4 py-2 bg-white text-black rounded-md font-medium">
                                                Quick View
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-1">Product Name {i + 1}</h3>
                                        <div className="flex items-center gap-1 mb-2">
                                            {Array.from({length: 5}).map((_, j) => (
                                                <svg key={j} className={`h-4 w-4 ${j < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="text-xs text-muted-foreground ml-1">(234)</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            High quality product with excellent features and great value
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-lg font-bold text-primary">${(29.99 + i * 10).toFixed(2)}</span>
                                                <span className="text-sm text-muted-foreground line-through ml-2">${(49.99 + i * 10).toFixed(2)}</span>
                                            </div>
                                            <button className="p-2 rounded-md hover:bg-accent transition-colors">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button className="px-4 py-2 rounded-md border hover:bg-accent transition-colors">
                                Previous
                            </button>
                            {[1, 2, 3, 4, 5].map((page) => (
                                <button
                                    key={page}
                                    className={`px-4 py-2 rounded-md border transition-colors ${
                                        page === 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="px-4 py-2 rounded-md border hover:bg-accent transition-colors">
                                Next
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PublicStore;