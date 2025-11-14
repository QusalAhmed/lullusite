"use client"

import React from "react"
import Link from "next/link"

// Auth
import { authClient } from "@/lib/auth-client";

// React Form
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

// Zod
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldDescription
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText
} from "@/components/ui/input-group"

// Icon
import {
    MailIcon,
} from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";

const formSchema = z.object({
    email: z
        .email('Please enter a valid email address.')
        .endsWith('@gmail.com', 'Email must be a Gmail address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(32, 'Password cannot exceed 32 characters.'),
})

export default function SignInForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        const {email, password} = formData;
        const {data, error} = await authClient.signIn.email({
            /**
             * The user email
             */
            email,
            /**
             * The user password
             */
            password,
            /**
             * A URL to redirect to after the user verifies their email (optional)
             */
            callbackURL: "/merchant/dashboard",
            /**
             * remember the user session after the browser is closed.
             * @default true
             */
            rememberMe: false
        }, {
            onRequest: (ctx) => {
                //show loading
                console.log("Signing up...", ctx);
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
                console.log("Sign up successful!", ctx);
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        })
        console.log("Sign In Response:", {data, error});
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                    <Link href={'/auth/sign-up'}>Don&#39;t have an account?</Link>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signin-form-title">
                                        Email
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <MailIcon/>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="signin-form-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your Gmail address"
                                            autoComplete="email"
                                        />
                                        <InputGroupAddon align="inline-end">
                                            {form.getValues("email") && !form.getValues("email").endsWith("@") &&
                                                <InputGroupText>@gmail.com</InputGroupText>}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signin-form-title">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signin-form-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
                                        type="password"
                                        autoComplete="current-password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                    <FieldDescription className="mt-1 text-right">
                                        <Link href="/auth/forgot-password" className="text-sm hover:underline">
                                            Forgot Password?
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Field orientation="horizontal">
                    <Button type="submit"
                            form="signin-form"
                            className={form.formState.isSubmitting ? "w-full opacity-70 pointer-events-none" : "w-full"}
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Login"}
                    </Button>
                </Field>
                <Button className={'w-full'} variant="outline">
                    <div className={'flex items-center justify-center gap-2'}>
                        <FcGoogle className="ml-2" size={48}/>
                        <span>Sign in with Google</span>
                    </div>
                </Button>
                <Button className={'w-full'} variant="outline">
                    <div className={'flex items-center justify-center gap-2'}>
                        <BsFacebook className="ml-2" size={48}/>
                        <span>Sign in with Facebook</span>
                    </div>
                </Button>
            </CardFooter>
        </Card>
    )
}
