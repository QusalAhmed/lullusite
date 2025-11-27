'use client'

// Columns & Table
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { ProductTableSkeleton } from "./product-table-skeleton"

// React Query
import {
    useQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'

// Types
import type { Products } from '@/actions/product/get-products'

// ShadCN
import { Button } from '@/components/ui/button'

// Create a client once per bundle
const queryClient = new QueryClient()

// Wrapper component exported
const ProductTable = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ProductsDataWrapper/>
        </QueryClientProvider>
    )
}

export default ProductTable;

// Separate component so provider is not recreated
function ProductsDataWrapper() {
    // Local pagination state (extend later if needed)
    const [limit] = useState(100)
    const [offset] = useState(0)

    const {data, isLoading, isError, error, refetch} = useQuery<Products[], Error>({
        queryKey: ['products', {limit, offset}],
        queryFn: async () => {
            const response = await fetch(`/api/merchant/products?limit=${limit}&offset=${offset}`)
            if (!response.ok) {
                throw new Error('Failed to fetch products')
            }
            return response.json()
        },
        staleTime: 60_000,
    })

    // Loading state
    if (isLoading) {
        return <ProductTableSkeleton />
    }

    // Error state
    if (isError) {
        return (
            <div className="p-4 text-sm text-red-600">
                Failed to load products: {error.message}
                <Button
                    className="ml-2 underline cursor-pointer"
                    onClick={() => refetch()}
                >
                    Retry
                </Button>
            </div>
        )
    }

    // Empty state
    if (!data || data.length === 0) {
        return <div className="p-4 text-sm text-muted-foreground">No products found.</div>
    }

    return <DataTable columns={columns} data={data}/>
}