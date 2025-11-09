"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"


// Zod schema
import subcategoryFormSchema from "@/lib/zod/subcategory.schema"

// Action
import addSubCategory from "@/actions/add-subcategory"

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

export default function SubCategoryForm(
    {categories, defaultCategory}: { categories: { label: string; value: string }[], defaultCategory?: string }
) {
    const form = useForm<z.infer<typeof subcategoryFormSchema>>({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            category: defaultCategory || "",
            name: "",
            description: "",
        },
    })

    async function onSubmit(data: z.infer<typeof subcategoryFormSchema>) {
        addSubCategory({data})
            .then(() => {
                toast.success("Sub category added successfully.")
                form.reset()
            })
            .catch((error) => {
                console.error(error)
                toast.error("There was an error adding the sub category.")
                form.setError('root', {message: 'There was an error adding the sub category.'})
            })
    }

    return (
        <form id="form-subcategory" onSubmit={form.handleSubmit(onSubmit)} className={'p-2 m-2'}>
            <FieldGroup>
                <Controller
                    name="category"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field
                            orientation="responsive"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldContent>
                                <FieldLabel htmlFor="form-category-select">
                                    Category
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
                                    id="form-category-select"
                                    aria-invalid={fieldState.invalid}
                                    className="min-w-[120px]"
                                >
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />
                <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-subcategory-name">
                                Sub category name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-subcategory-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Login button not working on mobile"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-subcategory-description">
                                Description
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-subcategory-description"
                                    placeholder="I'm having an issue with the login button on mobile."
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length}/100 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                Include steps to reproduce, expected behavior, and what
                                actually happened.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Field orientation="horizontal">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" form="form-subcategory" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                            <Spinner className="mr-2"/>
                            Submitting...
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </Field>
        </form>
    )
}
