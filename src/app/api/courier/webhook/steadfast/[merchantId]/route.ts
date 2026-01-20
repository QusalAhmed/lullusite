import { NextResponse, NextRequest } from 'next/server';

export async function POST(
    request: NextRequest,
    {params}: { params: { merchantId: string } }
) {
    const {merchantId} = params
    const requestBody = await request.json();
    console.log(`Received webhook for merchant ID: ${merchantId}`);
    console.log('Request body:', requestBody);

    try {
        const text = await request.text()
        console.log('Raw request body:', text)
        // Process the webhook payload
    } catch (error) {
        return NextResponse.json({status: 'error', message: error}, {status: 500});
    }

    return NextResponse.json({status: 'success', message: 'Webhook received successfully.'});
}