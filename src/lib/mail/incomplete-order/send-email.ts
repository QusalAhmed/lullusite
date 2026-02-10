'use server';

// react email
import React from 'react';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { Email } from './email';

// db
import db from "@/lib/drizzle-agent"
import { eq, and } from "drizzle-orm";
import { orderTable } from "@/db/index.schema";

interface IncompleteOrderData {
    merchantName: string;
    merchantEmail: string;
    orderId: string;
    createdDate: string;
    supportEmail: string;
    storeName: string;
    phoneNumber: string;
}

export async function sendEmail(
    data: IncompleteOrderData
) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const orderDetails = await db
        .query
        .orderTable
        .findFirst({
            where: and(
                eq(orderTable.id, data.orderId)
            ),
            columns: {
                id: true,
                orderNumber: true,
                shippingFullName: true,
                shippingPhone: true,
                createdAt: true,
                shippingAddress: true,
                subtotalAmount: true,
                shippingAmount: true,
                totalAmount: true,
            },
            with: {
                items: {
                    columns: {
                        id: true,
                        variationName: true,
                        quantity: true,
                        unitPrice: true,
                        lineTotal: true,
                        thumbnailUrl: true,
                    },
                },
                merchant: {
                    with: {
                        businessInformation: {
                            columns: {
                                email: true,
                                businessName: true,
                            },
                        }
                    }
                }
            },
        });

    if (!orderDetails) {
        console.error('Order details not found');
        return { success: false, message: 'Order details not found.' };
    }

    const merchantEmail = orderDetails?.merchant.businessInformation?.email;
    if (!merchantEmail) {
        console.error('Merchant email not found');
        return { success: false, message: 'Merchant email not found.' };
    }

    const htmlContent = await render(
        React.createElement(Email, {
            storeName: orderDetails.merchant.businessInformation?.businessName || 'Lullu Site',
            supportEmail: merchantEmail,
            customerName: orderDetails.shippingFullName,
            customerEmail: '',
            phoneNumber: orderDetails.shippingPhone,
            orderNumber: orderDetails.orderNumber,
            createdAt: orderDetails.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            currency: 'BDT',
            shippingAddress: orderDetails.shippingAddress,
            subtotalAmount: orderDetails.subtotalAmount,
            shippingAmount: orderDetails.shippingAmount,
            discountAmount: 0,
            totalAmount: orderDetails.totalAmount,
            items: orderDetails.items.map(item => ({
                productName: item.variationName || '',
                variationName: item.variationName || '',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: item.lineTotal,
            })),
        })
    );

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: merchantEmail,
            subject: 'Incomplete Order Alert',
            html: htmlContent,
        });
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send email.' };
    }
}
