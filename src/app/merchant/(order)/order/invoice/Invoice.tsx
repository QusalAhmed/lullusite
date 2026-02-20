import React, { useMemo } from 'react';
import Image from 'next/image'

// Action
import getOrders, { type InvoiceOrdersResponse } from "@/actions/invoice/get-orders";

// React Query
import { useQuery } from "@tanstack/react-query";

// ShadCN
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


// Constant
import ORDER_STATUS from "@/constant/order-status";
import PAYMENT_STATUS from "@/constant/payment-status";

type SellerBusinessDetails = {
    displayName: string
    legalName?: string
    addressLines?: string[]
    phone?: string
    email?: string
    fbPage?: string
    website?: string
    taxIdLabel?: string
    taxIdValue?: string
    tradeLicenseNo?: string
    supportNote?: string
}

const DEFAULT_SELLER_DETAILS: SellerBusinessDetails = {
    displayName: 'খেজুরের খাটি গুড়',
    // legalName: 'Your Legal Business Name',
    addressLines: [
        'Bagha, Rajshahi'
    ],
    phone: '01843557389',
    fbPage: 'https://www.facebook.com/khejurerkhatigur/',
    // email: 'support@example.com',
    // website: 'https://example.com',
    // taxIdLabel: 'BIN',
    // taxIdValue: 'XXXXXXXXXXXX',
    // tradeLicenseNo: 'XXXXXXXX',
    supportNote: 'WhatsApp ও Imo আছে।',
}

function safeDate(value: unknown): Date | null {
    if (!value) return null
    const d = value instanceof Date ? value : new Date(String(value))
    return Number.isNaN(d.getTime()) ? null : d
}

function formatMoney(amount: unknown, currency: string | null | undefined) {
    const n = typeof amount === 'number' ? amount : Number(amount)
    const safe = Number.isFinite(n) ? n : 0
    const c = currency || 'BDT'

    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: c,
            currencyDisplay: 'narrowSymbol',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            compactDisplay: 'long',
        }).format(safe)
    } catch {
        // fallback if currency code is invalid
        return `${safe.toFixed(2)} ${c}`
    }
}

function labelValue(label: string, value?: React.ReactNode) {
    if (!value) return null
    return (
        <div className="text-sm">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="font-medium text-foreground wrap-break-word">{value}</div>
        </div>
    )
}

function SellerDetails({ seller }: { seller: SellerBusinessDetails }) {
    const address = (seller.addressLines ?? []).map((l) => String(l).trim()).filter(Boolean)

    return (
        <div className="space-y-2 break-inside-avoid">
            <div className="text-xs text-muted-foreground">Sold by</div>

            <div className="space-y-0.5">
                <div className="text-xl font-semibold leading-tight wrap-break-word text-center">
                    {seller.displayName}
                </div>
                {seller.legalName ? (
                    <div className="text-xs text-muted-foreground wrap-break-word">
                        Legal name: {seller.legalName}
                    </div>
                ) : null}
            </div>

            {address.length ? (
                <div className="text-sm text-muted-foreground leading-snug">
                    {address.map((line, idx) => (
                        <div key={idx} className="wrap-break-word">{line}</div>
                    ))}
                </div>
            ) : null}

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {labelValue('Phone', seller.phone)}
                {labelValue('Email', seller.email)}
                {labelValue('Website', seller.website)}
                {labelValue('Facebook Page', seller.fbPage)}
                {seller.taxIdLabel && seller.taxIdValue
                    ? labelValue(seller.taxIdLabel, seller.taxIdValue)
                    : null}
                {labelValue('Trade license', seller.tradeLicenseNo)}
            </div>

            {seller.supportNote ? (
                <div className="text-xs text-muted-foreground wrap-break-word">
                    {seller.supportNote}
                </div>
            ) : null}
        </div>
    )
}

function InvoiceOrderView({order}: { order: InvoiceOrdersResponse[number] }) {
    const createdAt = safeDate(order.createdAt)
    const currency = order.currency ?? 'BDT'

    const items = useMemo(() => order.items ?? [], [order.items])

    const subtotal = order.subtotalAmount ?? items.reduce((sum, it) => sum + (it.lineSubtotal ?? 0), 0)
    const discount = order.discountAmount ?? items.reduce((sum, it) => sum + (it.lineDiscountAmount ?? 0), 0)
    const shipping = order.shippingAmount ?? 0
    const total = order.totalAmount ?? (subtotal - discount + shipping)

    return (
        <section
            className="bg-white text-black border border-border rounded-md p-6 print:border-0 print:rounded-none print:p-0 print:break-after-page">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                    <div className="text-lg font-semibold tracking-tight">INVOICE</div>
                    <div className="text-sm text-muted-foreground">
                        Order <span className={'text-lg text-black font-semibold'}>#{order.orderNumber}</span>
                    </div>
                    {createdAt ? (
                        <div className="text-xs text-muted-foreground">
                            Issued: {createdAt.toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                        </div>
                    ) : null}
                </div>

                <div className="text-right space-y-1">
                    <div className="text-sm">
                        <span className="text-muted-foreground">Status:</span>{' '}
                        <span className="font-medium">
                            {ORDER_STATUS.find(status => status.value === order.status)?.label || 'Unknown'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="text-muted-foreground">Payment:</span>{' '}
                        <span className="font-medium">
                            {PAYMENT_STATUS.find(status => status.value === order.paymentStatus)?.label || 'Unknown'}
                        </span>
                    </div>
                    {order.paymentMethod ? (
                        <div className="text-xs text-muted-foreground">Method: {String(order.paymentMethod)}</div>
                    ) : null}
                </div>
            </div>

            <Separator className="my-4"/>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-2">
                <SellerDetails seller={DEFAULT_SELLER_DETAILS} />

                <div className="space-y-2">
                    <div className="text-sm font-semibold">Ship To</div>
                    <div className="space-y-2">
                        {labelValue('Name', order.shippingFullName)}
                        {labelValue('Phone', order.shippingPhone)}
                        {labelValue(
                            'Address',
                            [
                                order.shippingAddress,
                                order.shippingCity,
                                order.shippingState,
                                order.shippingPostalCode,
                                order.shippingCountry,
                            ]
                                .filter(Boolean)
                                .join(', ')
                        )}
                    </div>
                </div>
            </div>

            <Separator className="my-4"/>

            {/* Table Items */}
            <Table>
                <TableCaption>A list of items.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Unit Discount</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell className="py-3 text-muted-foreground" colSpan={5}>
                                No items found for this order.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const thumb = item.variation?.images?.[0]?.image?.thumbnailUrl
                            const alt = item.variation?.images?.[0]?.image?.altText
                            const name = item.variation?.product?.name || item.variationName || 'Item'

                            return (
                                <TableRow key={item.id} className="border-b last:border-b-0 break-inside-avoid">
                                    <TableCell className="py-3 pr-2">
                                        <div className="flex items-center gap-3 min-w-[220px]">
                                            {thumb ? (
                                                <div className="relative size-10 rounded border overflow-hidden shrink-0">
                                                    <Image
                                                        src={thumb}
                                                        alt={alt || name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="40px"
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="leading-tight">
                                                <div className="text-xs text-muted-foreground wrap-break-word">{name}</div>
                                                {item.variationName ? (
                                                    <div className="font-medium wrap-break-word">
                                                        {item.variationName}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-lg">{item.quantity ?? 0}</TableCell>
                                    <TableCell>
                                        {formatMoney(item.unitPrice ?? 0, currency)}
                                    </TableCell>
                                    <TableCell>
                                        {formatMoney(item.lineDiscountAmount ?? 0, currency)}
                                    </TableCell>
                                    <TableCell className="py-3 pl-2 text-right whitespace-nowrap font-medium">
                                        {formatMoney(item.lineTotal ?? 0, currency)}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            <Separator className="my-4"/>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    {order.customerNote ? (
                        <div className="text-sm">
                            <div className="text-xs text-muted-foreground">Customer note</div>
                            <div className="whitespace-pre-wrap wrap-break-word">{order.customerNote}</div>
                        </div>
                    ) : null}
                </div>

                <div className="justify-self-stretch md:justify-self-end w-full md:max-w-sm">
                    <div className="border rounded-md p-4 space-y-2 break-inside-avoid">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">{formatMoney(subtotal, currency)}</span>
                        </div>
                        {discount ? (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="font-medium">- {formatMoney(discount, currency)}</span>
                            </div>
                        ) : null}
                        {shipping ? (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium">{formatMoney(shipping, currency)}</span>
                            </div>
                        ) : null}

                        <Separator/>

                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold">{formatMoney(total, currency)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs text-muted-foreground print:mt-4">
                This invoice is generated electronically and is valid without a signature.
            </div>
            {order.merchantNote ? (
                <div className="text-xs mt-3 text-muted-foreground flex justify-end">
                    {order.merchantNote}
                </div>
            ) : null}
        </section>
    )
}

const Invoice = ({orderIds}: { orderIds: string[] }) => {
    const {data: orders, isLoading, isError} = useQuery({
        queryKey: ['invoice-orders', orderIds],
        queryFn: () => getOrders(orderIds),
        enabled: orderIds.length > 0,
        staleTime: Infinity,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    if (orderIds.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                No order IDs provided. Add <span className="font-mono">?ids=orderId1,orderId2</span> to the URL.
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <Spinner className="size-8 text-muted-foreground"/>
                <span className="ml-2 text-sm text-muted-foreground">Loading invoice…</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <span className="text-sm text-destructive">Error loading invoice. Please try again.</span>
            </div>
        )
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                No orders found for the provided IDs.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <InvoiceOrderView key={order.id} order={order}/>
            ))}
        </div>
    );
};

export default Invoice;

