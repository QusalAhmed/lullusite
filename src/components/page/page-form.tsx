"use client"

import React, { useEffect, useId } from "react"
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

// Tanstack query
import { useQueryClient } from "@tanstack/react-query";

// Actions
import addPage from "@/actions/page/add-page"
import updatePage from "@/actions/page/update-page"

// ShadCN
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

// Validation schema
import { pageFormSchema } from "@/lib/validations/page.schema"

export default function PageForm({formData}: { formData?: z.infer<typeof pageFormSchema> }) {
    const formId = useId()
    const form = useForm<z.infer<typeof pageFormSchema>>({
        resolver: zodResolver(pageFormSchema),
        defaultValues: {
            id: formId,
            title: "",
            slug: "",
        },
    })
    const router = useRouter()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (formData) {
            form.reset(formData)
        }
    }, [formData, form])

    async function onSubmit(data: z.infer<typeof pageFormSchema>) {
        if (formData) {
            const response = await updatePage(data)
            if (response.success) {
                toast.success(response.message)
                await queryClient.invalidateQueries({queryKey: ['pages']})
                router.push('/merchant/landing-pages')
            } else {
                toast.error(response.message)
            }
            return
        }

        const response = await addPage(data)
        if (response.success) {
            toast.success(response.message)
            await queryClient.invalidateQueries({queryKey: ['pages']})
            router.push('/merchant/landing-pages')
        } else {
            toast.error(response.message)
        }
    }

    return (
        <Card className="w-full sm:max-w-md mx-auto">
            <CardHeader>
                <CardTitle>New Landing Page</CardTitle>
                <CardDescription>
                    Add new landing page to your store by filling out the form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-landing-page" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-landing-page-title">
                                        Page Title
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-landing-page-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="title of the landing page"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="slug"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-landing-page-slug">
                                        Slug
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-landing-page-slug"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="unique-slug-for-landing-page"
                                        autoComplete="off"
                                        disabled={!!formData}
                                    />
                                    <FieldDescription>
                                        The unique slug for the landing page url (e.g.,{" "}
                                        <code>unique-slug-for-landing-page</code>)
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="submit"
                            form="form-landing-page"
                            disabled={form.formState.isSubmitting}
                            className="cursor-pointer w-full"
                    >
                        {formData ? (
                            form.formState.isSubmitting ? (
                                <div className="flex items-center">
                                    <Spinner className="mr-2"/>
                                    Updating...
                                </div>
                            ) : "Update Page"
                        ) : (
                            form.formState.isSubmitting ? (
                                <div className="flex items-center">
                                    <Spinner className="mr-2"/>
                                    Creating...
                                </div>
                            ) : "Create Page"
                        )}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
