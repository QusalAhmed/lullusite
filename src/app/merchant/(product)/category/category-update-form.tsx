"use client"

import React, { useRef, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

// Local
import MyDropzone from "@/components/image-hub/ui"
import updateCategory from "@/actions/category/updateCategory"

// Zod
import * as z from "zod"
import { categoryFormSchema as formSchema } from "@/lib/validations/category.schema"

// ShadCN
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
import { Button } from "@/components/ui/button"

// Types
import type { ReadyImage } from "@/types/image-hub";


export default function UpdateCategoryForm(
    {
        name, description, image, categoryId, closeDialogAction
    }: {
        name: string,
        description: string,
        image?: ReadyImage,
        categoryId: string,
        closeDialogAction: () => void,
    }
) {
    const imageRef = useRef<ReadyImage[]>(image ? [image] : []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name || "",
            description: description,
            image: '',
        },
    })

    const setImageField = useCallback(() => {
        form.setValue('image', imageRef.current[0]?.serverImageId || "");
    }, [form]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const dataWithId = {...data, categoryId};
        const submitData = await updateCategory(dataWithId);
        console.log("Category updated:", submitData);
        if (submitData?.error) {
            toast.error(submitData.error);
            return;
        }
        toast.success("Category updated successfully!");
        form.reset();
        closeDialogAction();
    }

    return (
        <form id="form-new-category" onSubmit={form.handleSubmit(onSubmit)} className={'mx-2 px-2'}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-new-category-name">
                                Category Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-new-category-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter category name"
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
                            <FieldLabel htmlFor="form-new-category-description">
                                Description
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-new-category-description"
                                    placeholder="Describe the category"
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
                <Controller
                    name="image"
                    control={form.control}
                    render={({fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-new-category-image-upload">
                                Upload Image
                            </FieldLabel>
                            <FieldDescription>
                                Image url for the category (optional).
                            </FieldDescription>
                            <MyDropzone readyImagesRef={imageRef} maxFiles={1}/>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Field>
                    <Button type="button"
                            disabled={form.formState.isSubmitting}
                            onClick={() => {
                                setImageField();
                                form.handleSubmit(onSubmit)();
                            }}
                    >
                        {form.formState.isSubmitting ? "Updating..." : "Update Category"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
