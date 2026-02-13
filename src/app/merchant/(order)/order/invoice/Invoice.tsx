import React, { useMemo } from 'react';
import Image from 'next/image'

// Action
import getOrders, { type InvoiceOrdersResponse } from "@/actions/invoice/get-orders";

// React Query
import { useQuery } from "@tanstack/react-query";

// ShadCN
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";


// Constant
import ORDER_STATUS from "@/constant/order-status";
import PAYMENT_STATUS from "@/constant/payment-status";

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
                        Order #{order.orderNumber || order.id}
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
                <div className="space-y-2">
                    <div className="text-xl font-semibold">খেজুরের খাটি গুড়</div>
                    <div className="text-sm text-muted-foreground">
                        আমাদের খাঁটি গুড় কিনতে কল করুন <span className={'font-semibold text-lg'}>01843557389</span> নাম্বারে।
                        এই নাম্বারে WhatsApp ও Imo আছে।
                    </div>
                </div>

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

            {/* Items */}
            <div className="space-y-3">
                <div className="text-md font-semibold text-muted-foreground">Items</div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 pr-2 font-medium">Item</th>
                            <th className="text-right py-2 px-2 font-medium">Qty</th>
                            <th className="text-right py-2 px-2 font-medium">Unit</th>
                            <th className="text-right py-2 pl-2 font-medium">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td className="py-3 text-muted-foreground" colSpan={5}>
                                    No items found for this order.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const thumb = item.variation?.images?.[0]?.image?.thumbnailUrl
                                const alt = item.variation?.images?.[0]?.image?.altText
                                const name = item.variation?.product?.name || item.variationName || 'Item'

                                return (
                                    <tr key={item.id} className="border-b last:border-b-0 break-inside-avoid">
                                        <td className="py-3 pr-2">
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
                                                    <div className="font-medium wrap-break-word">{name}</div>
                                                    {item.variationName ? (
                                                        <div className="text-xs text-muted-foreground wrap-break-word">
                                                            {item.variationName}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-right">{item.quantity ?? 0}</td>
                                        <td className="py-3 px-2 text-right whitespace-nowrap">
                                            {formatMoney(item.unitPrice ?? 0, currency)}
                                        </td>
                                        <td className="py-3 pl-2 text-right whitespace-nowrap font-medium">
                                            {formatMoney(item.lineTotal ?? 0, currency)}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

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

