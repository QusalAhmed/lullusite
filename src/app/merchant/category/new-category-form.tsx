"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

// Local
import DropZone from "@/components/upload-file/ui"


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

const formSchema = z.object({
    name: z
        .string()
        .min(1, "Bug title must be at least 1 character.")
        .max(128, "Bug title must be at most 128 characters."),
    description: z
        .string()
        .max(1024, "Description must be at most 100 characters.")
        .optional(),
    image: z
        .url()
})

export default function NewCategoryForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
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
            duration: 1000,
        })
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
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-new-category-image-upload">
                                Upload Image
                            </FieldLabel>
                            <InputGroup>
                                <Input
                                    {...field}
                                    id="form-new-category-image-upload"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Upload cetegory logo"
                                    autoComplete="off"
                                />
                            </InputGroup>
                            <FieldDescription>
                                Image url for the category (optional).
                            </FieldDescription>
                            <DropZone maxFiles={1}/>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Field>
                    <Button type="submit" form="form-new-category">
                        Submit
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
