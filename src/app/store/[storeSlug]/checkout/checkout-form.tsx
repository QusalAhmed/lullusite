"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

// Zod schema
import {checkoutFormSchema} from "@/lib/validations/checkout.schema"

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
    { value: "dhaka", label: "ঢাকা বিভাগ" },
    { value: "chattogram", label: "চট্টগ্রাম বিভাগ" },
    { value: "rajshahi", label: "রাজশাহী বিভাগ" },
    { value: "khulna", label: "খুলনা বিভাগ" },
    { value: "barishal", label: "বরিশাল বিভাগ" },
    { value: "sylhet", label: "সিলেট বিভাগ" },
    { value: "rangpur", label: "রংপুর বিভাগ" },
    { value: "mymensingh", label: "ময়মনসিংহ বিভাগ" },
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

    function onSubmit(data: z.infer<typeof checkoutFormSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        })
    }

    return (
        <form id="form-checkout" onSubmit={form.handleSubmit(onSubmit)}>
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
                                placeholder="11 digit phone number"
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
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor="form-checkout-division">
                                    Division
                                </FieldLabel>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                    <SelectValue placeholder="Select" />
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
                    <Button type="submit" form="form-checkout" className="w-full">
                        Confirm Order
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default CheckoutForm
