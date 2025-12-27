"use client"

import React, { useEffect } from "react"
import {redirect} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import {validatePhoneNumber} from '@/lib/phone-number'

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

// Actions
import {createIncompleteOrder} from "@/actions/incomplete-order/create-incomplete-order"
import createOrder from "@/actions/order/create-order"

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

    const cartItems = useSelector((state: RootState) => state.cart.carts);
    const storeSlug = useSelector((state: RootState) => state.store.storeSlug);

    useEffect(() => {
        if (watchPhoneNumber && validatePhoneNumber(watchPhoneNumber).isValid) {
            // Create incomplete order
            createIncompleteOrder({
                phoneNumber: watchPhoneNumber,
                items: cartItems.map(item => ({
                    variationId: item.id,
                    quantity: item.quantity,
                })),
                metadata: {
                    customerName: form.getValues("name"),
                    address: form.getValues("address"),
                    division: form.getValues("division"),
                    remarks: form.getValues("remarks"),
                }
            }).then((response) => {
                if(response.success) {
                    console.log("Incomplete order created/updated successfully.")
                } else {
                    console.error(`Failed to create/update incomplete order: ${response.error}`)
                }
            }).catch((error) => {
                console.error(error)
            })
        }
    }, [cartItems, form, watchPhoneNumber])

    async function onSubmit(data: z.infer<typeof checkoutFormSchema>) {
        const response = createOrder({
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

        toast.promise(
            response,
            {
                loading: "Placing your order...",
                success: "Order placed successfully!",
                error: (err) => `Failed to place order: ${err.message}`,
            }
        )

        response.then((res) => {
            if (res.success) {
                // Redirect to order confirmation page
                redirect(`/store/${storeSlug}/order/${res.orderId}/confirmation`)
            }
        })
    }


    return (
        <form id="form-checkout" onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className='text-2xl text-center text-cyan-800'>Fill the form</h1>
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
                                    placeholder="I'm having an issue with the login button on mobile."
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
                            <FieldDescription>
                                Full address including street, city, and postal code.
                            </FieldDescription>
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
