"use client"

import { useState } from 'react'
import { validatePhoneNumber } from '@/lib/phone-number'

// Actions
import createIncompleteOrder from '@/actions/order/create-incomplete-order'

// ShadCN
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

// Icons
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CheckCircle2Icon } from "lucide-react"

export default function IncompleteOrder() {
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    return (
        <div className="flex justify-center p-4">
            <Card className="max-w-sm">
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                <DotLottieReact
                                    src="https://lottie.host/333d21e7-ae25-464c-ba72-402395b09037/U52nYnuVvC.lottie"
                                    loop={false}
                                    autoplay
                                />
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-lg font-semibold">
                                Success! {phoneNumber}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="text-center text-lg font-semibold text-green-600">
                            আপনার ফোন নাম্বার পেয়েছি। শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে অর্ডার কনফার্ম করার জন্য।
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction>বন্ধ করুন</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardHeader>
                    <CardTitle>
                        <DotLottieReact
                            src="https://lottie.host/cd99c59a-fb05-4fbd-9407-6af32f0d83ef/RP4ZXaXhhZ.lottie"
                            loop
                            autoplay
                        />
                    </CardTitle>
                    <CardDescription>
                        {isValid ? (
                            <Alert>
                                <CheckCircle2Icon />
                                <AlertTitle>Success! {phoneNumber}</AlertTitle>
                                <AlertDescription>
                                    আপনার ফোন নাম্বার পেয়েছি। শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে অর্ডার কনফার্ম করার জন্য।
                                </AlertDescription>
                            </Alert>
                        ): (
                            <div className="text-center text-lg font-semibold">
                                অর্ডার করতে সমস্যা হলে নিচে ফোন নাম্বার লিখুন। আমরা কল দিয়ে অর্ডার কনফার্ম করব।
                            </div>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <InputGroup>
                        <InputGroupAddon align="inline-start">
                            <span>🇧🇩 +88</span>
                        </InputGroupAddon>
                        <InputGroupInput
                            placeholder="01XXXXXXXXX"
                            type="tel"
                            maxLength={11}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="peer font-semibold text-lg text-center tracking-widest"
                            onChange={(event) => {
                                event.target.value = event.target.value.replace(/[^0-9+]/g, '');
                                const response = validatePhoneNumber(event.target.value);
                                if (response.isValid) {
                                    console.log('Valid phone number:', response.normalized);
                                    setIsValid(() => true);
                                    setIsOpen(() => true);
                                    setPhoneNumber(() => response.normalized!);
                                    createIncompleteOrder({
                                        phoneNumber: response.normalized!,
                                        source: 'incomplete-order-component',
                                    }).then(() => {
                                        console.log('Incomplete order created successfully');
                                    }).catch((error) => {
                                        console.error('Error creating incomplete order:', error);
                                    });
                                } else {
                                    setIsValid(() => false);
                                }
                            }}
                        />
                        {isValid && (
                            <InputGroupAddon align="inline-end">
                                <div className="w-8 h-8">
                                    <DotLottieReact
                                        src="https://lottie.host/333d21e7-ae25-464c-ba72-402395b09037/U52nYnuVvC.lottie"
                                        loop={false}
                                        autoplay
                                    />
                                </div>
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                </CardContent>
            </Card>
        </div>
    )
}
