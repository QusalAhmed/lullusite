"use client"

import React, { useEffect } from "react"

// React Form + Zod
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import analyticsSchema from "@/lib/validations/analytics.schema"

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
import { Switch } from "@/components/ui/switch"
import {
    InputGroup,
    InputGroupTextarea,
} from "@/components/ui/input-group"

// Action
import updateAnalytics from "@/actions/settings/update-analytics"

// Types
interface AnalyticsData {
    id?: string;
    userId?: string;
    facebookPixelId?: string | null;
    facebookConversionApiKey?: string | null;
    googleAnalyticsKey?: string | null;
    googleAnalyticsMeasurementId?: string | null;
    googleAdsConversionId?: string | null;
    googleAdsConversionLabel?: string | null;
    tiktokPixelId?: string | null;
    tiktokAccessToken?: string | null;
    snapchatPixelId?: string | null;
    linkedinPartnerId?: string | null;
    pinterestPixelId?: string | null;
    customTrackingCode?: string | null;
    isEnabled?: boolean | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export function AnalyticsForm({ analyticsData }: { analyticsData: AnalyticsData | null }) {
    const form = useForm<z.infer<typeof analyticsSchema>>({
        resolver: zodResolver(analyticsSchema),
        defaultValues: {
            facebookPixelId: "",
            facebookConversionApiKey: "",
            googleAnalyticsKey: "",
            googleAnalyticsMeasurementId: "",
            googleAdsConversionId: "",
            googleAdsConversionLabel: "",
            tiktokPixelId: "",
            tiktokAccessToken: "",
            snapchatPixelId: "",
            linkedinPartnerId: "",
            pinterestPixelId: "",
            customTrackingCode: "",
            isEnabled: true,
        },
    })

    useEffect(() => {
        if (analyticsData) {
            form.reset({
                facebookPixelId: analyticsData.facebookPixelId || "",
                facebookConversionApiKey: analyticsData.facebookConversionApiKey || "",
                googleAnalyticsKey: analyticsData.googleAnalyticsKey || "",
                googleAnalyticsMeasurementId: analyticsData.googleAnalyticsMeasurementId || "",
                googleAdsConversionId: analyticsData.googleAdsConversionId || "",
                googleAdsConversionLabel: analyticsData.googleAdsConversionLabel || "",
                tiktokPixelId: analyticsData.tiktokPixelId || "",
                tiktokAccessToken: analyticsData.tiktokAccessToken || "",
                snapchatPixelId: analyticsData.snapchatPixelId || "",
                linkedinPartnerId: analyticsData.linkedinPartnerId || "",
                pinterestPixelId: analyticsData.pinterestPixelId || "",
                customTrackingCode: analyticsData.customTrackingCode || "",
                isEnabled: analyticsData.isEnabled ?? true,
            });
        }
    }, [analyticsData, form]);

    async function onSubmit(data: z.infer<typeof analyticsSchema>) {
        const response = await updateAnalytics(data);

        if (response.success) {
            toast.success('Analytics configuration updated successfully')
        } else {
            toast.error(response.error || 'Failed to update analytics configuration')
            form.setError('root', {
                message: response.error || "An error occurred"
            })
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FieldGroup>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold">Analytics Configuration</h2>
                        <p className="text-sm text-muted-foreground">
                            Add tracking codes and API keys for your analytics and conversion tracking.
                        </p>
                    </div>
                    <Controller
                        name="isEnabled"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Enable Tracking</span>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className='data-[state=checked]:bg-green-500'
                                />
                            </div>
                        )}
                    />
                </div>

                {/* Facebook Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 10a10 10 0 11-20 0 10 10 0 0120 0z"/>
                        </svg>
                        Facebook
                    </h3>

                    <Controller
                        name="facebookPixelId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-facebook-pixel">
                                    Facebook Pixel ID
                                </FieldLabel>
                                <FieldDescription>
                                    Your Facebook Pixel ID for tracking conversions
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-facebook-pixel"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., 123456789012345"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="facebookConversionApiKey"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-facebook-conv-key">
                                    Conversion API Key
                                </FieldLabel>
                                <FieldDescription>
                                    Server-side conversion tracking API key
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-facebook-conv-key"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your Conversion API key"
                                    type="text"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Google Analytics Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                        </svg>
                        Google Analytics
                    </h3>

                    <Controller
                        name="googleAnalyticsKey"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-ga-key">
                                    Analytics Key (GA4 Property ID)
                                </FieldLabel>
                                <FieldDescription>
                                    Your Google Analytics 4 Property ID
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-ga-key"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., 123456789"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="googleAnalyticsMeasurementId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-ga-measurement">
                                    Measurement ID
                                </FieldLabel>
                                <FieldDescription>
                                    Google Analytics 4 Measurement ID (G-XXXXX)
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-ga-measurement"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., G-XXXXXXXXXX"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Google Ads Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"/>
                        </svg>
                        Google Ads
                    </h3>

                    <Controller
                        name="googleAdsConversionId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-gads-conversion-id">
                                    Conversion ID
                                </FieldLabel>
                                <FieldDescription>
                                    Your Google Ads Conversion ID
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-gads-conversion-id"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., AW-123456789"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="googleAdsConversionLabel"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-gads-conversion-label">
                                    Conversion Label
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-gads-conversion-label"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., wXlzCM..."
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* TikTok Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0z"/>
                        </svg>
                        TikTok
                    </h3>

                    <Controller
                        name="tiktokPixelId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-tiktok-pixel">
                                    Pixel ID
                                </FieldLabel>
                                <FieldDescription>
                                    Your TikTok Pixel ID for conversion tracking
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-tiktok-pixel"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., B1G123ABC..."
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="tiktokAccessToken"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-tiktok-token">
                                    Access Token
                                </FieldLabel>
                                <FieldDescription>
                                    Server-side API access token for TikTok Events
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-tiktok-token"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your access token"
                                    type="password"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Snapchat Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0z"/>
                        </svg>
                        Snapchat
                    </h3>

                    <Controller
                        name="snapchatPixelId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-snapchat-pixel">
                                    Pixel ID
                                </FieldLabel>
                                <FieldDescription>
                                    Your Snapchat Pixel ID for conversion tracking
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-snapchat-pixel"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., 123456789..."
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* LinkedIn Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.337 1H3.663A2.662 2.662 0 001 3.663v12.674A2.662 2.662 0 003.663 19h12.674A2.662 2.662 0 0019 16.337V3.663A2.662 2.662 0 0016.337 1zM6.5 15.5h-2v-7h2v7zm-1-8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm10 8.5h-2v-3.5c0-.83-.333-1.5-1-1.5s-1.5.67-1.5 1.5v3.5h-2v-7h2v1c.333-.5 1.333-1 2.5-1 2 0 3.5 1.5 3.5 4v3z"/>
                        </svg>
                        LinkedIn
                    </h3>

                    <Controller
                        name="linkedinPartnerId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-linkedin-partner">
                                    Partner ID (Insight Tag)
                                </FieldLabel>
                                <FieldDescription>
                                    Your LinkedIn Insight Tag Partner ID
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-linkedin-partner"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., 123456"
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Pinterest Section */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-.5 3.5a.5.5 0 110 1 .5.5 0 010-1zm3 0a.5.5 0 110 1 .5.5 0 010-1zm-1.5 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/>
                        </svg>
                        Pinterest
                    </h3>

                    <Controller
                        name="pinterestPixelId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-pinterest-pixel">
                                    Pixel ID
                                </FieldLabel>
                                <FieldDescription>
                                    Your Pinterest Pixel ID for conversion tracking
                                </FieldDescription>
                                <Input
                                    {...field}
                                    id="form-pinterest-pixel"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., 123456789..."
                                    disabled={!form.getValues('isEnabled')}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Custom Tracking Code */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base">Custom Tracking Code</h3>

                    <Controller
                        name="customTrackingCode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-custom-code">
                                    Custom HTML/JavaScript
                                </FieldLabel>
                                <FieldDescription>
                                    Add any custom tracking scripts or pixels (e.g., Google Tag Manager, custom analytics)
                                </FieldDescription>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        id="form-custom-code"
                                        placeholder="Paste your custom tracking code here..."
                                        rows={6}
                                        className="min-h-24 resize-none font-mono text-xs"
                                        aria-invalid={fieldState.invalid}
                                        disabled={!form.getValues('isEnabled')}
                                    />
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <Field orientation="horizontal">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting || !form.getValues('isEnabled')}
                    >
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Analytics Configuration'}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default AnalyticsForm;

