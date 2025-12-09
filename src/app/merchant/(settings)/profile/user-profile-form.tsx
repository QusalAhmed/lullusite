"use client"

import React, { useEffect } from "react"

// React Form + Zod
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import userSchema from "@/lib/validations/user.schema"


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

// Type
import type { GetUserType } from "@/lib/get-user";

// Action
import updateProfile from "@/actions/settings/update-profile";

export function UserProfileForm({userProfile}: { userProfile: GetUserType }) {
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
        },
    })

    useEffect(() => {
        console.log(userProfile);
        if (userProfile) {
            form.reset({
                name: userProfile.name || "",
            });
        }
    }, [userProfile, form]);

    function onSubmit(data: z.infer<typeof userSchema>) {
        if (userProfile && data.name == userProfile.name) {
            toast.info('No changes detected')
            return;
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

                <Field orientation="horizontal">
                    <Button type="submit" form="form-profile" className={'w-full'} disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default UserProfileForm;
