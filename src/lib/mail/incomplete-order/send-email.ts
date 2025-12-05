'use server';

import nodemailer from 'nodemailer';
// import fs from 'fs';
// import path from 'path';

interface IncompleteOrderData {
    merchantName: string;
    merchantEmail: string;
    orderId: string;
    createdDate: string;
    supportEmail: string;
    storeName: string;
    phoneNumber: string;
}


// function replaceTemplateVariables(
//     template: string,
//     data: IncompleteOrderData
// ): string {
//     let html = template;
//
//     html = html.replace('{{merchantName}}', data.merchantName);
//     html = html.replace('{{orderId}}', data.orderId);
//     html = html.replace('{{phoneNumber}}', data.phoneNumber);
//     html = html.replace('{{createdDate}}', data.createdDate)
//     html = html.replace('{{supportEmail}}', data.supportEmail);
//     html = html.replace('{{storeName}}', data.storeName);
//     html = html.replace('{{currentYear}}', new Date().getFullYear().toString());
//
//     return html;
// }

export async function sendEmail(
    data: IncompleteOrderData
) {
    // const templatePath = path.join(
    //     process.cwd(),
    //     'src/lib/mail/incomplete-order/body.html'
    // );
    //
    // let htmlTemplate: string;
    // try {
    //     htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    // } catch (error) {
    //     console.error('Failed to read email template:', error);
    //     return { success: false, message: 'Failed to load email template.' };
    // }
    //
    // const htmlBody = replaceTemplateVariables(htmlTemplate, data);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: data.merchantEmail,
            subject: `Incomplete Order Alert - Order #${data.orderId}`,
            text: `You have a new incomplete order (Order ID: ${data.orderId}). Please follow up with the customer at ${data.phoneNumber}.`,
        });
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send email.' };
    }
}
