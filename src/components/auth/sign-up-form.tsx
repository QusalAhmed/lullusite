"use client"

import React, { useState } from "react"
import Link from "next/link"
import { redirect } from 'next/navigation'

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
} from "@/components/ui/field"
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
    InputGroupText,
    InputGroupButton
} from "@/components/ui/input-group"

// Icon
import {
    MailIcon,
    UserPen,
    Eye,
    EyeOff,
    KeyRound
} from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";

const formSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long.')
        .max(50, 'Name cannot exceed 50 characters.'),
    email: z
        .email('Please enter a valid email address.')
        .endsWith('@gmail.com', 'Email must be a Gmail address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(32, 'Password cannot exceed 32 characters.'),
    confirmPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(32, 'Password cannot exceed 32 characters.'),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            // Use the Zod issue code enum and point the issue to the confirmPassword field
            code: 'custom',
            message: 'Passwords do not match.',
            path: ['confirmPassword'],
        })
    }
});


export default function SignInForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    // visibility toggles for password fields
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        const { name, email, password } = formData;
        const { data, error } = await authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name, // user display name
            callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
        }, {
            onRequest: (ctx) => {
                //show loading
                console.log("Signing up...", ctx);
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
                console.log("Sign up successful!", ctx);
                redirect('/dashboard');
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        });
        console.log("Sign up data:", data, "Error:", error);
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                    <Link href={'/auth/sign-in'}>Already have an account?</Link>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-form-name">
                                        Full Name
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <UserPen/>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="signup-form-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your full name"
                                        />
                                    </InputGroup>
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
                                    <FieldLabel htmlFor="signup-form-email">
                                        Email
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <MailIcon/>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="signup-form-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your Gmail address"
                                            autoComplete="email"
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>@gmail.com</InputGroupText>
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
                                    <FieldLabel htmlFor="signup-form-password">
                                        Password
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <KeyRound/>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="signup-form-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                type="button"
                                                variant="ghost"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                title={showPassword ? 'Hide password' : 'Show password'}
                                                onClick={() => setShowPassword((v) => !v)}
                                            >
                                                {showPassword ? <EyeOff/> : <Eye/>}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-form-confirm-password">
                                        Confirm
                                        Password
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <KeyRound/>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            {...field}
                                            id="signup-form-confirm-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ReEnter your password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                type="button"
                                                variant="ghost"
                                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                            >
                                                {showConfirmPassword ? <EyeOff/> : <Eye/>}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Field>
                    <Button type="submit"
                            form="signup-form"
                            className={form.formState.isSubmitting ? "w-full opacity-70 pointer-events-none" : "w-full"}
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Login"}
                    </Button>
                </Field>
                <Button className={'w-full'} variant="outline">
                    <div className={'flex items-center justify-center gap-2'}>
                        <FcGoogle className="ml-2" size={48}/>
                        <span>Sign up with Google</span>
                    </div>
                </Button>
                <Button className={'w-full'} variant="outline">
                    <div className={'flex items-center justify-center gap-2'}>
                        <BsFacebook className="ml-2" size={48}/>
                        <span>Sign up with Facebook</span>
                    </div>
                </Button>
            </CardFooter>
        </Card>
    )
}
