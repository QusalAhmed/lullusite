"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import courierSettingsFormSchema, { CourierSettingsFormValues } from "@/lib/validations/courier.schema";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import saveCourierSettings from "@/actions/settings/save-courier-settings";

// Shape coming from server (Drizzle row)
interface CourierRow {
    id?: string;
    userId?: string;
    courierCode: string;
    courierName: string | null;
    apiKey: string | null;
    username: string | null;
    apiSecret: string | null;
    accountId: string | null;
    isEnabled: boolean;
}

export function CourierSettingsForm({ existingCouriers }: { existingCouriers: CourierRow[] }) {
    const form = useForm<CourierSettingsFormValues>({
        resolver: zodResolver(courierSettingsFormSchema),
        defaultValues: {
            steadfast: {
                courierCode: "steadfast",
                courierName: "Steadfast",
                apiKey: "",
                username: "",
                apiSecret: "",
                accountId: "",
                isEnabled: false,
            },
            redx: {
                courierCode: "redx",
                courierName: "RedX",
                apiKey: "",
                username: "",
                apiSecret: "",
                accountId: "",
                isEnabled: false,
            },
            pathao: {
                courierCode: "pathao",
                courierName: "Pathao",
                apiKey: "",
                username: "",
                apiSecret: "",
                accountId: "",
                isEnabled: false,
            },
        },
    });

    useEffect(() => {
        if (!existingCouriers?.length) return;

        const byCode: Partial<CourierSettingsFormValues> = {};

        for (const row of existingCouriers) {
            if (row.courierCode === "steadfast") {
                byCode.steadfast = {
                    courierCode: "steadfast",
                    courierName: row.courierName || "",
                    apiKey: row.apiKey || "",
                    username: row.username || "",
                    apiSecret: row.apiSecret || "",
                    accountId: row.accountId || "",
                    isEnabled: row.isEnabled,
                };
            }
            if (row.courierCode === "redx") {
                byCode.redx = {
                    courierCode: "redx",
                    courierName: row.courierName || "",
                    apiKey: row.apiKey || "",
                    username: row.username || "",
                    apiSecret: row.apiSecret || "",
                    accountId: row.accountId || "",
                    isEnabled: row.isEnabled,
                };
            }
            if (row.courierCode === "pathao") {
                byCode.pathao = {
                    courierCode: "pathao",
                    courierName: row.courierName || "",
                    apiKey: row.apiKey || "",
                    username: row.username || "",
                    apiSecret: row.apiSecret || "",
                    accountId: row.accountId || "",
                    isEnabled: row.isEnabled,
                };
            }
        }

        form.reset({
            steadfast: {
                courierCode: "steadfast",
                courierName: byCode.steadfast?.courierName || "Steadfast",
                apiKey: byCode.steadfast?.apiKey || "",
                username: byCode.steadfast?.username || "",
                apiSecret: byCode.steadfast?.apiSecret || "",
                accountId: byCode.steadfast?.accountId || "",
                isEnabled: byCode.steadfast?.isEnabled ?? false,
            },
            redx: {
                courierCode: "redx",
                courierName: byCode.redx?.courierName || "RedX",
                apiKey: byCode.redx?.apiKey || "",
                username: byCode.redx?.username || "",
                apiSecret: byCode.redx?.apiSecret || "",
                accountId: byCode.redx?.accountId || "",
                isEnabled: byCode.redx?.isEnabled ?? false,
            },
            pathao: {
                courierCode: "pathao",
                courierName: byCode.pathao?.courierName || "Pathao",
                apiKey: byCode.pathao?.apiKey || "",
                username: byCode.pathao?.username || "",
                apiSecret: byCode.pathao?.apiSecret || "",
                accountId: byCode.pathao?.accountId || "",
                isEnabled: byCode.pathao?.isEnabled ?? false,
            },
        });
    }, [existingCouriers, form]);

    async function onSubmit(values: CourierSettingsFormValues) {
        const res = await saveCourierSettings(values);

        if (res.success) {
            toast.success("Courier settings updated successfully");
        } else {
            toast.error(res.error || "Failed to update courier settings");
        }
    }

    function CourierCard({ code, title, description }: { code: keyof CourierSettingsFormValues; title: string; description: string }) {
        const isEnabled = useWatch({ control: form.control, name: `${code}.isEnabled` as const });

        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <Controller
                        name={`${code}.isEnabled` as const}
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Enabled</span>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                        )}
                    />
                </CardHeader>
                <CardContent className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>API Key</FieldLabel>
                            <Controller
                                name={`${code}.apiKey` as const}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputGroup>
                                            <Input
                                                {...field}
                                                placeholder="Enter API key"
                                                disabled={!isEnabled}
                                            />
                                        </InputGroup>
                                        {fieldState.error && (
                                            <FieldError>{fieldState.error.message}</FieldError>
                                        )}
                                    </>
                                )}
                            />
                            <FieldDescription>
                                Courier API key used to authenticate requests.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Username</FieldLabel>
                            <Controller
                                name={`${code}.username` as const}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder="Enter account username"
                                            disabled={!isEnabled}
                                        />
                                        {fieldState.error && (
                                            <FieldError>{fieldState.error.message}</FieldError>
                                        )}
                                    </>
                                )}
                            />
                            <FieldDescription>
                                Account username for this courier provider.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>API Secret (optional)</FieldLabel>
                            <Controller
                                name={`${code}.apiSecret` as const}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter API secret"
                                            disabled={!isEnabled}
                                        />
                                        {fieldState.error && (
                                            <FieldError>{fieldState.error.message}</FieldError>
                                        )}
                                    </>
                                )}
                            />
                            <FieldDescription>
                                Secret/token if required by this courier API.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Account ID (optional)</FieldLabel>
                            <Controller
                                name={`${code}.accountId` as const}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder="Enter account ID"
                                            disabled={!isEnabled}
                                        />
                                        {fieldState.error && (
                                            <FieldError>{fieldState.error.message}</FieldError>
                                        )}
                                    </>
                                )}
                            />
                            <FieldDescription>
                                Internal account identifier if your courier uses one.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
                <h2 className="text-lg font-semibold">Courier Configuration</h2>
                <p className="text-sm text-muted-foreground">
                    Add API credentials and enable or disable individual courier providers.
                </p>
            </div>

            <div className="space-y-6">
                <CourierCard
                    code="steadfast"
                    title="Steadfast"
                    description="Configure Steadfast courier API access."
                />
                <CourierCard
                    code="redx"
                    title="RedX"
                    description="Configure RedX courier API access."
                />
                <CourierCard
                    code="pathao"
                    title="Pathao"
                    description="Configure Pathao courier API access."
                />
            </div>

            <Button type="submit" className="mt-4">
                Save courier settings
            </Button>
        </form>
    );
}
