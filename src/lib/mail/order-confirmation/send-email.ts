import nodemailer from 'nodemailer';

interface OrderItem {
    productName: string;
    variationName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

interface OrderConfirmationData {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    createdDate: string;
    phoneNumber: string;
    storeName: string;
    supportEmail: string;
    shippingFullName: string;
    shippingAddressLine1: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    shippingPhone: string;
    subtotalAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    items: OrderItem[];
}

function generateEmailTemplate(data: OrderConfirmationData): string {
    // Generate order items HTML
    const orderItemsHTML = data.items
        .map(
            (item) => `
        <div class="item">
            <div class="item-info">
                <div class="item-name">${item.productName}</div>
                <div class="item-details">
                    Variation: ${item.variationName} | Qty: ${item.quantity}
                </div>
            </div>
            <div class="item-price">
                ${data.currency} ${item.lineTotal.toFixed(2)}
            </div>
        </div>
    `
        )
        .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 30px;
            color: #333;
        }
        .order-details {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .order-details h3 {
            font-size: 14px;
            color: #667eea;
            text-transform: uppercase;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .detail-label {
            color: #666;
            font-weight: 500;
        }
        .detail-value {
            color: #333;
            font-weight: 600;
        }
        .items-section {
            margin: 30px 0;
        }
        .items-section h3 {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
            font-weight: 600;
        }
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: #f9f9f9;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .item-info {
            flex: 1;
        }
        .item-name {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .item-details {
            font-size: 12px;
            color: #666;
        }
        .item-price {
            text-align: right;
            font-weight: 600;
            color: #667eea;
        }
        .totals {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            margin: 30px 0;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .total-row.final {
            border-top: 2px solid #ddd;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 16px;
            font-weight: 600;
            color: #667eea;
        }
        .shipping-info {
            background-color: #f0f4ff;
            padding: 20px;
            border-radius: 4px;
            margin: 30px 0;
        }
        .shipping-info h3 {
            font-size: 14px;
            color: #667eea;
            text-transform: uppercase;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .shipping-address {
            font-size: 14px;
            line-height: 1.6;
            color: #333;
        }
        .next-steps {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            margin: 30px 0;
        }
        .next-steps h3 {
            font-size: 14px;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }
        .next-steps li {
            font-size: 13px;
            padding: 8px 0 8px 25px;
            position: relative;
            color: #666;
        }
        .next-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .footer p {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .footer-link {
            color: #667eea;
            text-decoration: none;
        }
        .store-name {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        .support-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
        }
        .support-info p {
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Order Confirmed! 🎉</h1>
            <p>${data.storeName}</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <!-- Greeting -->
            <div class="greeting">
                Hi ${data.customerName},
            </div>

            <p style="margin-bottom: 20px; line-height: 1.6; font-size: 14px;">
                Thank you for your order! We're delighted to confirm that your purchase has been successfully received. 
                Your order is now being prepared for shipment.
            </p>

            <!-- Order Details -->
            <div class="order-details">
                <h3>Order Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Order Number:</span>
                    <span class="detail-value">#${data.orderNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date:</span>
                    <span class="detail-value">${data.createdDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Status:</span>
                    <span class="detail-value">Pending</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact Number:</span>
                    <span class="detail-value">${data.phoneNumber}</span>
                </div>
            </div>

            <!-- Order Items -->
            <div class="items-section">
                <h3>Order Items</h3>
                ${orderItemsHTML}
            </div>

            <!-- Totals -->
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${data.currency} ${data.subtotalAmount.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>${data.currency} ${data.shippingAmount.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Discount:</span>
                    <span>-${data.currency} ${data.discountAmount.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                    <span>Total:</span>
                    <span>${data.currency} ${data.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <!-- Shipping Information -->
            <div class="shipping-info">
                <h3>Shipping Address</h3>
                <div class="shipping-address">
                    ${data.shippingFullName}<br>
                    ${data.shippingAddressLine1}<br>
                    ${data.shippingCity}, ${data.shippingPostalCode}<br>
                    ${data.shippingCountry}<br>
                    <br>
                    <strong>Phone:</strong> ${data.shippingPhone}
                </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>What Happens Next?</h3>
                <ul>
                    <li>We'll prepare your items for shipment</li>
                    <li>You'll receive a shipping confirmation with tracking details</li>
                    <li>Track your package in real-time</li>
                    <li>Receive your order at the address provided</li>
                </ul>
            </div>

            <p style="margin: 30px 0; font-size: 14px; line-height: 1.6;">
                If you have any questions about your order or need assistance, please don't hesitate to reach out to us.
                We're here to help!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="store-name">${data.storeName}</div>
            <p>
                Thank you for shopping with us! We appreciate your business and look forward to serving you again.
            </p>
            <div class="support-info">
                <p>
                    Questions? Contact us at <a href="mailto:${data.supportEmail}" class="footer-link">${data.supportEmail}</a>
                </p>
                <p>© ${new Date().getFullYear()} ${data.storeName}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(
    data: OrderConfirmationData
): Promise<{ success: boolean; message: string; error?: string }> {
    try {
        const htmlBody = generateEmailTemplate(data);

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Send email
        const mailOptions = {
            from: 'Lullu Site',
            to: 'qusalcse@gmail.com',
            subject: `Order Confirmation - #${data.orderNumber}`,
            text: `You got a new order confirmation for order #${data.orderNumber}`,
            html: htmlBody,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Order confirmation email sent:', info.messageId);

        return {
            success: true,
            message: 'Order confirmation email sent successfully',
        };
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return {
            success: false,
            message: 'Failed to send email',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

