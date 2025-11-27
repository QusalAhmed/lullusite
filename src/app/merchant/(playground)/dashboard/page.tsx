import React from 'react';

const DashBoardPage = async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here&apos;s an overview of your store performance.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold">$45,231.89</p>
                        </div>
                        <div className="rounded-full bg-primary/10 p-3">
                            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">+20.1% from last month</p>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Orders</p>
                            <p className="text-2xl font-bold">+2,350</p>
                        </div>
                        <div className="rounded-full bg-blue-500/10 p-3">
                            <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">+180.1% from last month</p>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Products</p>
                            <p className="text-2xl font-bold">+12,234</p>
                        </div>
                        <div className="rounded-full bg-green-500/10 p-3">
                            <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">+19% from last month</p>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                            <p className="text-2xl font-bold">+573</p>
                        </div>
                        <div className="rounded-full bg-orange-500/10 p-3">
                            <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">+201 since last hour</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="rounded-lg border bg-card col-span-4 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Overview</h3>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Chart placeholder - Revenue over time
                    </div>
                </div>

                <div className="rounded-lg border bg-card col-span-3 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                    {i}
                                </div>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium">Customer Name {i}</p>
                                    <p className="text-xs text-muted-foreground">customer{i}@email.com</p>
                                </div>
                                <div className="ml-auto font-medium">+$1,999.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-4 text-sm">
                        <div className="rounded-full bg-blue-500/10 p-2">
                            <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">New order received</p>
                            <p className="text-muted-foreground">Order #12345 from John Doe</p>
                        </div>
                        <span className="text-muted-foreground text-xs">2 min ago</span>
                    </div>
                    <div className="flex items-start gap-4 text-sm">
                        <div className="rounded-full bg-green-500/10 p-2">
                            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Product updated</p>
                            <p className="text-muted-foreground">Premium Widget v2 successfully updated</p>
                        </div>
                        <span className="text-muted-foreground text-xs">15 min ago</span>
                    </div>
                    <div className="flex items-start gap-4 text-sm">
                        <div className="rounded-full bg-orange-500/10 p-2">
                            <svg className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Low stock alert</p>
                            <p className="text-muted-foreground">Widget Pro has only 5 units left</p>
                        </div>
                        <span className="text-muted-foreground text-xs">1 hour ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoardPage;