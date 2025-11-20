'use client'


import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, PlusCircle, ListOrdered, LayoutDashboard } from 'lucide-react'

export default function AddProductSuccessPage() {
    const params = useParams() as { productId?: string }
    const productId = params?.productId

    return (
        <div className="flex flex-col items-center justify-center py-24 px-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="size-6"/>
                        <CardTitle className="text-xl">Product Added Successfully</CardTitle>
                    </div>
                    <CardDescription>Your product has been saved and is now part of your catalog.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {productId && (
                        <p className="text-sm">Reference ID: <span className="font-mono font-semibold text-primary">{productId}</span>
                        </p>
                    )}
                    <div className="grid gap-3 text-sm">
                        <p className="text-muted-foreground">Next steps you might want to take:</p>
                        <ul className="grid gap-2 list-none m-0 p-0">
                            <li className="flex items-center gap-2">
                                <PlusCircle className="size-4 mt-0.5 text-primary"/>
                                <span>
                                    Add another product to grow your catalog.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ListOrdered className="size-4 mt-0.5 text-primary"/>
                                <span>
                                    Review all products to ensure details are correct.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <LayoutDashboard className="size-4 mt-0.5 text-primary"/>
                                <span>
                                    Head to the dashboard to monitor performance.
                                </span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {productId && (
                        <Button asChild variant="default" className="w-full">
                            <Link href={`/merchant/product/${productId}`}>View Product</Link>
                        </Button>
                    )}
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/merchant/add-product">Add Another Product</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full">
                        <Link href="/merchant/products">All Products</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                        <Link href="/merchant/dashboard">Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
