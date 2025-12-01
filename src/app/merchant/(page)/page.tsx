import React from 'react';

const Page = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Page Builder</h1>
                        <p className="text-sm text-muted-foreground">Create and customize your store pages</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border rounded-md hover:bg-accent transition-colors">
                            Preview
                        </button>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                            Publish
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Components/Blocks */}
                <aside className="w-64 border-r bg-card overflow-y-auto">
                    <div className="p-4">
                        <h3 className="font-semibold mb-4">Components</h3>
                        <div className="space-y-2">
                            {/* Component Categories */}
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">Layout</h4>
                                {['Section', 'Container', 'Grid', 'Flex'].map((item) => (
                                    <button
                                        key={item}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                                            </svg>
                                            {item}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">Content</h4>
                                {['Heading', 'Text', 'Image', 'Button', 'Link'].map((item) => (
                                    <button
                                        key={item}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            {item}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1 pt-4">
                                <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">Blocks</h4>
                                {['Hero', 'Features', 'Gallery', 'Testimonials', 'Contact Form'].map((item) => (
                                    <button
                                        key={item}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            {item}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Canvas Area */}
                <main className="flex-1 overflow-y-auto bg-muted/30">
                    <div className="p-8">
                        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border min-h-[800px] p-8">
                            {/* Empty State */}
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                <svg className="h-24 w-24 text-muted-foreground/50 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <h2 className="text-2xl font-semibold mb-2">Start Building Your Page</h2>
                                <p className="text-muted-foreground max-w-md mb-6">
                                    Drag and drop components from the left sidebar to create your perfect page layout
                                </p>
                                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                                    Add Your First Component
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Properties */}
                <aside className="w-72 border-l bg-card overflow-y-auto">
                    <div className="p-4">
                        <h3 className="font-semibold mb-4">Properties</h3>
                        <div className="text-sm text-muted-foreground text-center py-8">
                            Select a component to edit its properties
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Page;