"use client"

import React, { useEffect } from "react"

// React Form + Zod
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import userSchema from "@/lib/zod/user.schema"


// ShadCN
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

// Type
import type { GetUserType } from "@/lib/get-user";

// Action
import updateProfile from "@/actions/settings/update-profile";

export function UserProfileForm({userProfile}: { userProfile: GetUserType }) {
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            address: "",
            businessName: "",
            details: "",
        },
    })

    useEffect(() => {
        console.log(userProfile);
        if (userProfile) {
            form.reset({
                name: userProfile.name || "",
                // @ts-expect-error unavoidable as better-auth pre build column
                businessName: userProfile?.additionalInfo?.businessName || "",
                // @ts-expect-error unavoidable as better-auth pre build column
                details: userProfile?.additionalInfo?.details || "",
                // @ts-expect-error unavoidable as better-auth pre build column
                address: userProfile?.additionalInfo?.address || "",
            });
        }
    }, [userProfile, form]);

    function onSubmit(data: z.infer<typeof userSchema>) {
        if (userProfile && data.name == userProfile.name) {
            data.name = ''
        }
        updateProfile(data).then((res) => {
            if (res.success) {
                toast.success('Updated')
            } else {
                form.setError('root', {
                    message: ""
                })
            }
        })
    }

    return (
        <form id="form-profile" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldDescription>
                    Don&#39;t forget to save your changes by clicking
                    <span className="bg-emerald-400 p-2 m-2 rounded-md text-black font-semibold">Update</span>
                    button before leaving.
                </FieldDescription>
                <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-name">
                                Full Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter full name"
                                autoComplete="on"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="businessName"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-business-name">
                                Business Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-business-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter business name"
                                autoComplete="on"
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
                            <FieldLabel htmlFor="form-business-address">
                                Business Address
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-business-address"
                                    placeholder="Enter your full business address"
                                    rows={4}
                                    className="min-h-12 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field?.value?.length}/100 characters
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
                    name="details"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-details">
                                Additional Details
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-details"
                                    placeholder="Enter additional details about your business"
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field?.value?.length}/100 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Field orientation="horizontal">
                    <Button type="submit" form="form-profile" className={'w-full'}>
                        Update
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default UserProfileForm;
