"use client"

import React, { useEffect, useRef } from "react"

// React Form + Zod
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import businessInformationSchema from "@/lib/validations/business-information.schema"

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

// Image Hub
import ImageHub from "@/components/image-hub/ui"
import type { ReadyImage } from "@/types/image-hub"

// Action
import updateBusinessInformation from "@/actions/settings/update-business-information"

// Types
interface BusinessInformation {
    id?: string;
    businessName: string;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    description?: string | null;
    logoImageId?: string | null;
    logoImage?: {
        id: string;
        url: string;
        thumbnailUrl: string;
    } | null;
}

export function BusinessInformationForm({businessInfo}: { businessInfo: BusinessInformation | null }) {
    const logoImagesRef = useRef<ReadyImage[]>([]);

    const form = useForm<z.infer<typeof businessInformationSchema>>({
        resolver: zodResolver(businessInformationSchema),
        defaultValues: {
            businessName: "",
            address: "",
            email: "",
            phone: "",
            description: "",
            logoImageId: "",
        },
    })

    useEffect(() => {
        if (businessInfo) {
            form.reset({
                businessName: businessInfo.businessName || "",
                address: businessInfo.address || "",
                email: businessInfo.email || "",
                phone: businessInfo.phone || "",
                description: businessInfo.description || "",
                logoImageId: businessInfo.logoImageId || "",
            });

            // Set existing logo image if available
            if (businessInfo.logoImage) {
                logoImagesRef.current = [{
                    serverImageId: businessInfo.logoImage.id,
                    previewURL: businessInfo.logoImage.thumbnailUrl,
                    hash: businessInfo.logoImage.id, // Using ID as hash for existing images
                }];
            }
        }
    }, [businessInfo, form]);

    const updateImage = () => {
        const logoImages = logoImagesRef.current;
        if (logoImages.length > 0) {
            form.setValue("logoImageId", logoImages[0].serverImageId || "");
        } else {
            form.setValue("logoImageId", "");
        }
    };

    async function onSubmit(data: z.infer<typeof businessInformationSchema>) {
        const response = await updateBusinessInformation(data);

        if (response.success) {
            toast.success('Business information updated successfully')
        } else {
            toast.error(response.error || 'Failed to update business information')
            form.setError('root', {
                message: response.error || "An error occurred"
            })
        }
    }

    return (
        <form id="form-business-info" className="space-y-6">
            <FieldGroup>
                <FieldDescription>
                    Update your business information. Click
                    <span className="bg-emerald-400 p-2 m-2 rounded-md text-black font-semibold">Update</span>
                    to save your changes.
                </FieldDescription>

                <Controller
                    name="businessName"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-business-name">
                                Business Name <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-business-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your business name"
                                autoComplete="organization"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-business-email">
                                Business Email
                            </FieldLabel>
                            <Input
                                {...field}
                                type="email"
                                id="form-business-email"
                                aria-invalid={fieldState.invalid}
                                placeholder="business@example.com"
                                autoComplete="email"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="phone"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-business-phone">
                                Business Phone
                            </FieldLabel>
                            <Input
                                {...field}
                                type="tel"
                                id="form-business-phone"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter phone number"
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
                                        {field?.value?.length || 0}/512 characters
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
                    name="description"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-description">
                                Business Description
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-description"
                                    placeholder="Tell us about your business"
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field?.value?.length || 0}/1024 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Field>
                    <FieldLabel>Business Logo</FieldLabel>
                    <FieldDescription>
                        Upload your business logo (recommended size: 512x512px)
                    </FieldDescription>
                    <ImageHub readyImagesRef={logoImagesRef} maxFiles={1}/>
                </Field>

                <Field orientation="horizontal">
                    <Button
                        type="button"
                        form="form-business-info"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                        onClick={()=> {
                            updateImage()
                            form.handleSubmit(onSubmit)()
                        }}
                    >
                        {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default BusinessInformationForm;

