"use client"

import React, {useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"


// Zod schema
import subcategoryFormSchema from "@/lib/validations/subcategory.schema"

// Action
import addSubCategory from "@/actions/category/add-subcategory"
import updateSubcategory from "@/actions/category/update-subcategory"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Icon
import { AlertCircleIcon } from "lucide-react"

export default function SubCategoryForm(
    {categories, categoryId, defaultCategory, name, description}: {
        categories: { label: string; value: string }[],
        categoryId?: string,
        defaultCategory?: string,
        name?: string,
        description?: string,
    }
) {
    const form = useForm<z.infer<typeof subcategoryFormSchema>>({
        resolver: zodResolver(subcategoryFormSchema),
        defaultValues: {
            category: defaultCategory || "",
            name: "",
            description: "",
        },
    })
    
    useEffect(() => {
        if (name) {
            form.setValue('name', name)
        }
        if (description) {
            form.setValue('description', description)
        }


        return () => {
            form.reset()
        }
    }, [defaultCategory, name, description, form])

    async function onSubmit(data: z.infer<typeof subcategoryFormSchema>) {
        if (categoryId) {
            await updateSubcategory({data: {...data, id: categoryId}})
                .then((res) => {
                    if(!res.success){
                        toast.error(res.error)
                        form.setError('root', {message: res.error || 'There was an error updating the subcategory.'})
                        return
                    }
                    toast.success('Sub category updated successfully.')
                })
                .catch((error) => {
                    console.error(error)
                    toast.error('There was an error updating the sub category.')
                })
            return
        } else {
            await addSubCategory({data})
                .then((res) => {
                    if(!res.success){
                        toast.error(res.error)
                        form.setError('root', {message: res.error || 'Subcategory already exists.'})
                        return
                    }
                    toast.success('Sub category added successfully.')
                    form.reset()
                })
                .catch((error) => {
                    console.error(error)
                    toast.error('There was an error adding the sub category.')
                })
        }
    }

    return (
        <form id="form-subcategory" onSubmit={form.handleSubmit(onSubmit)} className={'p-2 m-2'}>
            {form.formState.errors.root && (
                <Field data-invalid={true}>
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            <FieldError errors={[form.formState.errors.root]}/>
                        </AlertDescription>
                    </Alert>
                </Field>
            )}
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
                            'Submit'
                        )}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
