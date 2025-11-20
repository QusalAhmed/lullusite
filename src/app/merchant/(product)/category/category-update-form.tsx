"use client"

import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

// Local
import DropZone from "@/components/upload-file/ui"
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


export default function UpdateCategoryForm(
    {name, description, image, categoryId}: { name: string, description: string, image: string, categoryId: string }
) {
    const [imageUrl, setImageUrl] = useState<string>(image || "");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name || "",
            description: description,
            image: image,
        },
    })

    useEffect(() => {
        if (imageUrl) {
            form.setValue("image", imageUrl);
        } else {
            form.setValue("image", "");
        }
    }, [imageUrl, form]);

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
        setImageUrl('');
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
                            <DropZone maxFiles={1} setImageUrl={setImageUrl}/>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Field>
                    <Button type="submit" form="form-new-category">
                        Update
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
