"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { validatePhoneNumber } from '@/lib/phone-number'
import { useDebouncedCallback } from 'use-debounce';

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

// Actions
import createOrder from "@/actions/order/create-order"
import createIncompleteOrder from "@/actions/order/create-incomplete-order"

// Zod schema
import { checkoutFormSchema } from "@/lib/validations/checkout.schema"

// ShadCN
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Tanstack Query
import { useMutation } from "@tanstack/react-query"

export const divisions = [
    {value: "dhaka", label: "ঢাকা বিভাগ"},
    {value: "chattogram", label: "চট্টগ্রাম বিভাগ"},
    {value: "rajshahi", label: "রাজশাহী বিভাগ"},
    {value: "khulna", label: "খুলনা বিভাগ"},
    {value: "barishal", label: "বরিশাল বিভাগ"},
    {value: "sylhet", label: "সিলেট বিভাগ"},
    {value: "rangpur", label: "রংপুর বিভাগ"},
    {value: "mymensingh", label: "ময়মনসিংহ বিভাগ"},
] as const;

export function CheckoutForm() {
    const form = useForm<z.infer<typeof checkoutFormSchema>>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            name: "",
            address: "",
            division: "",
            phoneNumber: "",
            remarks: "",
        },
    })
    const watchPhoneNumber = useWatch({
        control: form.control,
        name: "phoneNumber",
    })
    const watchAddress = useWatch({
        control: form.control,
        name: "address",
    })

    const mutation = useMutation({
        mutationKey: ["incomplete-order", watchPhoneNumber],
        mutationFn: (
            {address, variations}: {address: string, variations: Array<{variationId: string, quantity: number}>}
        ) => createIncompleteOrder({
            name: form.getValues("name"),
            phoneNumber: watchPhoneNumber,
            address: address,
            division: form.getValues("division"),
            remark: form.getValues("remarks"),
            variations: variations,
            source: "checkout_form",
        }),
        onSuccess: () => {
            console.log("Incomplete order saved:")
        },
        onError: (error) => {
            console.error("Failed to save incomplete order:", error)
        },
        scope: {
            id: "incomplete_order",
        },
        retry: false,
    })

    const debouncedMutation = useDebouncedCallback(
        (data: {address: string, variations: Array<{variationId: string, quantity: number}>}) => {
            console.log("Triggering debounced mutation with data:", data)
            mutation.mutate(data)
        },
        5000,
        {
            leading: true,
            trailing: true,
        }
    )

    const cartItems = useSelector((state: RootState) => state.cart.carts);
    const storeSlug = useSelector((state: RootState) => state.store.storeSlug);
    const router = useRouter();

    useEffect(() => {
        if (watchPhoneNumber && validatePhoneNumber(watchPhoneNumber).isValid) {
            debouncedMutation({
                address: watchAddress.trim(),
                variations: cartItems.map(item => ({
                    variationId: item.id,
                    quantity: item.quantity,
                })),
            })
        }
    }, [cartItems, watchPhoneNumber, watchAddress, debouncedMutation])

    async function onSubmit(data: z.infer<typeof checkoutFormSchema>) {
        const toastId = toast.loading("Creating your order...")
        try {
            const response = await createOrder({
                name: data.name,
                phoneNumber: data.phoneNumber,
                address: data.address,
                division: data.division,
                remark: data.remarks,
                variations: cartItems.map(item => ({
                    variationId: item.id,
                    quantity: item.quantity,
                })),
            })

            if (response.success) {
                toast.success("Order created successfully!", {id: toastId, duration: 500})
                // Redirect to order confirmation page
                router.push(`/store/${storeSlug}/order/${response.orderId}/confirmation`)
            }
        } catch (error) {
            toast.error(`An error occurred: ${error}`, {id: toastId})
        }
    }


    return (
        <form id="form-checkout" onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className='text-2xl text-center text-cyan-800 mb-2'>Fill the form to complete order</h1>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-checkout-name">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-checkout-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Your full name"
                                autoComplete="name"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-checkout-name">
                                Phone Number
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-checkout-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., +8801712345678 or 01712345678"
                                autoComplete="tel"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="address"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-checkout-address">
                                Address
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-checkout-address"
                                    placeholder="Full address including house number, road number, city"
                                    rows={2}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete='street-address'
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length} characters
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
                    name="division"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor="form-checkout-division">
                                    Division
                                </FieldLabel>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                            </FieldContent>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="form-checkout-division"
                                    aria-invalid={fieldState.invalid}
                                    className="min-w-[120px]"
                                >
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {divisions.map((division) => (
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
                    name="remarks"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-checkout-remarks">
                                Remarks
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-checkout-remarks"
                                    placeholder="Please deliver between 9 AM to 5 PM."
                                    rows={2}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length} characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                Extra information about your order.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Field>
                    <Button
                        type="submit"
                        form="form-checkout"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Confirming Order..." : "Confirm Order"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default CheckoutForm
