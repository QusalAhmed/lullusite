"use client"

import React, { useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { v4 } from 'uuid'

// Notification
import { toast } from "sonner"

// Form
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch, useFieldArray } from "react-hook-form"

// ShadCN
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardAction
} from "@/components/ui/card"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"

// Icon
import { AlertCircle, Clock, RefreshCcw, XIcon } from "lucide-react"

// Type
import { GetOrderToEditReturnType } from '@/actions/order/get-order-to-edit'


// Zod
import { z } from 'zod'

// Schema
import { OrderSelectSchemaType, orderSelectSchema } from '@/lib/validations/order.schema'

// Local
import ItemPicker from './item-picker'

// Actions
import merchantUpdateOrder from '@/actions/order/merchant-update-order'
import merchantCreateOrder from '@/actions/order/merchant-create-order'

// Constant
import DIVISION_LIST from '@/constant/division'
import ORDER_STATUS from "@/constant/order-status";
import PAYMENT_STATUS from "@/constant/payment-status";
import ACTION_SOURCES from "@/constant/action-source";

const formatDate = (date: Date | string) => {
    const d = (date instanceof Date) ? date : new Date(date)
    if (Number.isNaN(d.getTime())) return ""

    // Hydration-safe: fixed locale + fixed timezone so SSR and client output match.
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(d)
};

export default function OrderForm({formData}: { formData?: GetOrderToEditReturnType }) {
    const router = useRouter()
    const form = useForm<OrderSelectSchemaType>({
        resolver: zodResolver(orderSelectSchema),
        defaultValues: {
            // Identifiers
            id: formData?.id || v4(),

            // Customer contact snapshot
            customerName: formData?.customerName || null,
            customerEmail: formData?.customerEmail || null,
            customerPhone: formData?.customerPhone || null,
            customerAdditionalPhone: formData?.customerAdditionalPhone || null,

            // Status
            status: formData?.status || "pending",
            paymentStatus: formData?.paymentStatus || "unpaid",

            // Monetary
            currency: "BDT",
            subtotalAmount: formData?.subtotalAmount || 0,
            discountAmount: formData?.discountAmount || 0,
            shippingAmount: formData?.shippingAmount || 0,
            partialAmount: formData?.partialAmount || 0,
            taxAmount: formData?.taxAmount || 0,
            totalAmount: formData?.totalAmount || 0,

            // Shipping address snapshot
            shippingFullName: formData?.shippingFullName || undefined,
            shippingPhone: formData?.shippingPhone || undefined,
            shippingEmail: formData?.shippingEmail || null,
            shippingAddress: formData?.shippingAddress || undefined,
            shippingCity: formData?.shippingCity || '',
            shippingDivision: formData?.shippingDivision || 'auto',
            shippingState: formData?.shippingState || null,
            shippingPostalCode: formData?.shippingPostalCode || null,
            shippingCountry: formData?.shippingCountry || '',
            shippingNotes: formData?.shippingNotes || null,

            // Payment / channel metadata
            paymentMethod: formData?.paymentMethod || null,
            paymentProvider: formData?.paymentProvider || null,
            paymentReference: formData?.paymentReference || null,
            externalOrderId: formData?.externalOrderId || null,
            paymentNote: formData?.paymentNote || null,

            // Analytics
            ipAddress: formData?.ipAddress || '',
            userAgent: formData?.userAgent || '',
            actionSource: formData?.actionSource,
            eventSourceUrl: formData?.eventSourceUrl || '',
            reportToPixel: formData?.reportToPixel || false,
            fbc: formData?.fbc || null,
            fbp: formData?.fbp || '',
            sourceChannel: formData?.sourceChannel || {},

            // Notes
            customerNote: formData?.customerNote || null,
            merchantNote: formData?.merchantNote || null,

            // Items
            items: formData?.items.map(item => ({
                variationId: item.productVariationId,
                variationName: item.variationName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discountPrice: item.lineDiscountAmount,
                totalPrice: item.lineTotal,
                thumbnailUrl: item.thumbnailUrl,
            })) || [],
        },
    })
    console.log('error', form.formState.errors);

    const paymentStatus = useWatch({
        control: form.control,
        name: "paymentStatus",
    });

    const items = useWatch({
        control: form.control,
        name: "items",
    });

    const subtotalAmount = items.reduce((acc, item) => {
        const itemTotal = (item.unitPrice * item.quantity) - item.discountPrice;
        return acc + (itemTotal >= 0 ? itemTotal : 0);
    }, 0)

    const shippingAmount = useWatch({
        control: form.control,
        name: 'shippingAmount',
    });

    const discountAmount = useWatch({
        control: form.control,
        name: 'discountAmount',
    });

    const partialAmount = useWatch({
        control: form.control,
        name: 'partialAmount',
    });

    const totalAmount = subtotalAmount + shippingAmount - discountAmount;
    const amountPaid = paymentStatus === 'partially_paid' ?
        partialAmount : paymentStatus === 'paid' ? totalAmount : 0;
    const amountDue = subtotalAmount + shippingAmount - discountAmount - amountPaid;

    useEffect(() => {
        if (paymentStatus !== 'partially_paid') {
            form.clearErrors('partialAmount');
            form.setValue('partialAmount', 0);
        }
        if (paymentStatus === 'paid') {
            form.setValue('partialAmount', totalAmount);
        }
    }, [paymentStatus, form, totalAmount]);

    const {fields: itemFields, remove: itemRemove, prepend: itemPrepend} = useFieldArray({
        control: form.control,
        name: "items",
    })

    const handleAddItem = useCallback((item: {
        variationId: string
        variationName: string;
        unitPrice: number;
        thumbnailUrl: string;
    }[]) => {
        item.forEach((it) => {
            if (form.getValues("items").some((existing) => existing.variationId === it.variationId)) {
                return;
            }
            itemPrepend({
                variationId: it.variationId,
                variationName: it.variationName,
                quantity: 1,
                unitPrice: it.unitPrice,
                discountPrice: 0,
                totalPrice: it.unitPrice,
                thumbnailUrl: it.thumbnailUrl,
            });
        })

        // Remove items with not selected variations
        const selectedVariationIds = item.map(i => i.variationId);
        form.getValues("items").forEach((existingItem) => {
            if (!selectedVariationIds.includes(existingItem.variationId)) {
                const fieldIndex = form.getValues("items").findIndex(i => i.variationId === existingItem.variationId);
                if (fieldIndex !== -1) {
                    itemRemove(fieldIndex);
                }
            }
        })
    }, [form, itemPrepend, itemRemove]);

    async function onSubmit(data: z.infer<typeof orderSelectSchema>) {
        if (formData) {
            const response = await merchantUpdateOrder(data);

            if (response.success) {
                toast.success("Order updated successfully.");
                router.push('/merchant/all-orders');
            } else {
                toast.error(`Failed to update order: ${response.message || 'Unknown error'}`);
            }
        } else {
            const response = await merchantCreateOrder(data);
            if (response.success) {
                toast.success("Order created successfully.");
                router.push('/merchant/all-orders');
            } else {
                toast.error(`Failed to create order: ${response.message || 'Unknown error'}`);
            }
        }
    }

    return (
        <>
            {formData ? (
                <div className='mb-6'>
                    <h2 className="text-2xl font-semibold text-cyan-800">Edit Order #{formData.orderNumber}</h2>
                    <h6 className='text-gray-400 text-sm'>ID: {formData.id}</h6>
                    <div className='mt-1 space-y-1 text-sm text-gray-500'>
                        <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4'/>
                            <span>Created {formatDate(formData.createdAt)}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <RefreshCcw className='h-4 w-4'/>
                            <span>Updated {formatDate(formData.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <h2 className="mb-6 text-2xl font-bold">Create New Order</h2>
            )}
            <form id="order-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                    {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
                        <Alert variant="destructive" className="col-span-full mb-4">
                            <AlertCircle/>
                            <AlertTitle>Form Errors</AlertTitle>
                            <AlertDescription>
                                Please fix the following errors before submitting:
                                <ul className="mt-2 list-disc pl-5">
                                    {Object.entries(form.formState.errors).map(([key, error]) => (
                                        <li key={key}>
                                            {key}: {error?.message as string}
                                            {error.root?.message}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                            <CardDescription>
                                Shipping address details for this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Controller
                                    name="shippingFullName"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-shipping-full-name">
                                                Shipping Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-shipping-full-name"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="on"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="shippingPhone"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-shipping-phone">
                                                Shipping Phone
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-shipping-phone"
                                                type="tel"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="shippingAddress"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-shipping-address">
                                                Shipping Address
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="form-shipping-address"
                                                    rows={3}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <InputGroupAddon align="block-end">
                                                    <InputGroupText className="tabular-nums">
                                                        {field.value?.length} characters
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="shippingDivision"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-shipping-division">
                                                    Shipping Division
                                                </FieldLabel>
                                                <FieldDescription>
                                                    Important for conversion API
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]}/>
                                                )}
                                            </FieldContent>
                                            <Select
                                                name={field.name}
                                                value={field.value || ''}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="form-shipping-division"
                                                    aria-invalid={fieldState.invalid}
                                                    className="min-w-[120px]"
                                                >
                                                    <SelectValue placeholder="Select"/>
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned">
                                                    <SelectItem value="auto">Auto</SelectItem>
                                                    <SelectSeparator/>
                                                    {DIVISION_LIST.map((division) => (
                                                        <SelectItem key={division.value} value={division.value}>
                                                            {division.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="shippingPostalCode"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-shipping-postal-code">
                                                Postal Code
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-shipping-postal-code"
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="on"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="shippingNotes"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-shipping-notes">
                                                Shipping Note
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-shipping-note"
                                                type="tel"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-order-status">
                                                    Order Status
                                                </FieldLabel>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]}/>
                                                )}
                                            </FieldContent>
                                            <Select
                                                name={field.name}
                                                value={field.value || 'pending'}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="form-order-status"
                                                    aria-invalid={fieldState.invalid}
                                                    className="min-w-[120px]"
                                                >
                                                    <SelectValue placeholder="Select"/>
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned">
                                                    {ORDER_STATUS.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>
                                                            {status.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="paymentStatus"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-payment-status">
                                                    Payment Status
                                                </FieldLabel>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]}/>
                                                )}
                                            </FieldContent>
                                            <Select
                                                name={field.name}
                                                value={field.value || 'unpaid'}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="form-payment-status"
                                                    aria-invalid={fieldState.invalid}
                                                    className="min-w-[120px]"
                                                >
                                                    <SelectValue placeholder="Select"/>
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned">
                                                    {PAYMENT_STATUS.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>
                                                            {status.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="partialAmount"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-partial-amount">
                                                Partial Amount
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-partial-amount"
                                                type="number"
                                                step="10"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                disabled={paymentStatus !== 'partially_paid'}
                                                onChange={(e) => {
                                                    field.onChange(parseFloat(e.target.value || '0'));
                                                }}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="merchantNote"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-merchant-note">
                                                Merchant Note
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="form-merchant-note"
                                                    rows={2}
                                                    aria-invalid={fieldState.invalid}
                                                    value={field.value ?? ""}
                                                />
                                                <InputGroupAddon align="block-end">
                                                    <InputGroupText className="tabular-nums">
                                                        {field.value?.length} characters
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Controller
                                    name="ipAddress"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-ip-address">
                                                IP Address
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-ip-address"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="userAgent"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-user-agent">
                                                User Agent
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-user-agent"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="actionSource"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-action-source">
                                                    Action Source
                                                </FieldLabel>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]}/>
                                                )}
                                            </FieldContent>
                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="form-action-source"
                                                    aria-invalid={fieldState.invalid}
                                                    className="min-w-[120px]"
                                                >
                                                    <SelectValue placeholder="Select"/>
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned">
                                                    {ACTION_SOURCES.map((source) => (
                                                        <SelectItem key={source.value} value={source.value}>
                                                            {source.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="eventSourceUrl"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-event-source-url">
                                                Event Source URL
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-event-source-url"
                                                type="url"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="sourceChannel.channel"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-source-channel">
                                                Source Channel Channel
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-source-channel"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="sourceChannel.source"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-source-source">
                                                Source Channel Source
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-source-source"
                                                type="text"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                            <CardAction>
                                <ItemPicker
                                    handleAddItem={handleAddItem}
                                    currentItems={items.map((item) => ({
                                        variationId: item.variationId,
                                        variationName: item.variationName || '',
                                        unitPrice: item.unitPrice,
                                        thumbnailUrl: item.thumbnailUrl,
                                    }))}
                                />
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="gap-4">
                                <Table>
                                    <TableCaption>Order items</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Discount</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {itemFields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell className="whitespace-normal max-w-xs">
                                                    <Image
                                                        src={form.getValues(`items.${index}.thumbnailUrl`)}
                                                        alt={form.getValues(`items.${index}.variationName`) || 'Product Image'}
                                                        width={40}
                                                        height={40}
                                                        className="inline-block rounded-md mr-2"
                                                    />
                                                    {form.getValues(`items.${index}.variationName`)}
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        key={field.id}
                                                        name={`items.${index}.unitPrice`}
                                                        control={form.control}
                                                        render={({field: controllerField, fieldState}) => (
                                                            <Field
                                                                orientation="horizontal"
                                                                data-invalid={fieldState.invalid}
                                                            >
                                                                <FieldContent>
                                                                    <InputGroup>
                                                                        <InputGroupInput
                                                                            {...controllerField}
                                                                            id={`form-item-${index}-unit-price`}
                                                                            aria-invalid={fieldState.invalid}
                                                                            type="number"
                                                                            min={0}
                                                                            step={10}
                                                                        />
                                                                    </InputGroup>
                                                                    {fieldState.invalid && (
                                                                        <FieldError errors={[fieldState.error]}/>
                                                                    )}
                                                                </FieldContent>
                                                            </Field>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        key={field.id}
                                                        name={`items.${index}.quantity`}
                                                        control={form.control}
                                                        render={({field: controllerField, fieldState}) => (
                                                            <Field
                                                                orientation="horizontal"
                                                                data-invalid={fieldState.invalid}
                                                            >
                                                                <FieldContent>
                                                                    <InputGroup>
                                                                        <InputGroupInput
                                                                            {...controllerField}
                                                                            id={`form-item-${index}-quantity`}
                                                                            aria-invalid={fieldState.invalid}
                                                                            type="number"
                                                                            min={0}
                                                                            step={1}
                                                                        />
                                                                    </InputGroup>
                                                                    {fieldState.invalid && (
                                                                        <FieldError errors={[fieldState.error]}/>
                                                                    )}
                                                                </FieldContent>
                                                            </Field>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        key={field.id}
                                                        name={`items.${index}.discountPrice`}
                                                        control={form.control}
                                                        render={({field: controllerField, fieldState}) => (
                                                            <Field
                                                                orientation="horizontal"
                                                                data-invalid={fieldState.invalid}
                                                            >
                                                                <FieldContent>
                                                                    <InputGroup>
                                                                        <InputGroupInput
                                                                            {...controllerField}
                                                                            id={`form-item-${index}-discount-amount`}
                                                                            aria-invalid={fieldState.invalid}
                                                                            type="number"
                                                                            min={0}
                                                                            step={10}
                                                                        />
                                                                    </InputGroup>
                                                                    {fieldState.invalid && (
                                                                        <FieldError errors={[fieldState.error]}/>
                                                                    )}
                                                                </FieldContent>
                                                            </Field>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {(() => {
                                                        const item = items?.[index];
                                                        const totalPrice = item
                                                            ? (item.unitPrice * item.quantity) - item.discountPrice
                                                            : 0;
                                                        return (totalPrice >= 0 ? totalPrice : 0).toFixed(2);
                                                    })()}
                                                </TableCell>
                                                <TableCell>
                                                    <InputGroupAddon align="inline-end">
                                                        <InputGroupButton
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon-xs"
                                                            onClick={() => itemRemove(index)}
                                                            aria-label={`Remove item ${index + 1}`}
                                                        >
                                                            <XIcon color={'red'}/>
                                                        </InputGroupButton>
                                                    </InputGroupAddon>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </FieldGroup>
                            {form.formState.errors.items?.root && (
                                <FieldError errors={[form.formState.errors.items.root]}/>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Controller
                                    name="shippingAmount"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-subtotal">
                                                Courier charge
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-subtotal"
                                                type="number"
                                                min="0"
                                                step="10"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="on"
                                                onChange={(e) => {
                                                    field.onChange(parseFloat(e.target.value || '0'));
                                                }}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="discountAmount"
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-total">
                                                Discount
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-total"
                                                type="number"
                                                min="0"
                                                step="10"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="on"
                                                onChange={(e) => {
                                                    field.onChange(parseFloat(e.target.value || '0'));
                                                }}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <div className="text-xl font-semibold">
                                    {subtotalAmount}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Shipping fee</span>
                                <div className="text-xl font-semibold">
                                    {shippingAmount}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Discount</span>
                                <div className="text-xl font-semibold">
                                    -{discountAmount}
                                </div>
                            </div>
                            <div className="flex items-center justify-between bg-muted px-4 py-2 mt-4 rounded-md">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <div className="text-xl font-bold">
                                    {subtotalAmount + shippingAmount - discountAmount}
                                </div>
                            </div>
                            <div className={'grid grid-cols-2 gap-4 mt-4'}>
                                <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-md">
                                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                                    <div className="text-xl font-semibold text-green-600">
                                        {amountPaid}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-md">
                                    <span className="text-sm text-muted-foreground">Amount Due</span>
                                    <div className="text-xl font-bold text-red-600">
                                        {amountDue}
                                    </div>
                                </div>
                            </div>


                        </CardContent>
                    </Card>
                    <FieldGroup className="col-span-full grid grid-cols-2 gap-4">
                        <Field orientation="horizontal">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                className="w-full"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                form="order-form"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? <Spinner/> : null}
                                Submit
                            </Button>
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </form>
        </>
    )
}
