import { NextResponse, NextRequest } from 'next/server';

// db
import db from '@/lib/drizzle-agent';
import { eq, and } from 'drizzle-orm';
import { orderTable, orderTrackingTable } from '@/db/index.schema';

// Constants
import ORDER_STATUS from '@/constant/order-status';

interface NotificationType {
    notification_type: 'delivery_status' | 'tracking_update';
}

interface DeliveryStatus extends NotificationType {
    consignment_id: number;
    invoice: string;
    cod_amount: number;
    status: string;
    delivery_charge: number;
    tracking_message: string;
    updated_at: string;
}

interface TrackingUpdate extends NotificationType {
    consignment_id: number;
    invoice: string;
    tracking_message: string;
    updated_at: string;
}

async function updateStatus(consignmentId: number, status: (typeof ORDER_STATUS)[number]['value'], merchantId: string) {
    console.log(consignmentId, status, merchantId);
    await db
        .update(orderTable)
        .set({status: status})
        .where(
            and(
                eq(orderTable.consignmentsId, consignmentId.toString()),
                eq(orderTable.merchantId, merchantId)
            )
        );
}

async function insertTracking(orderId: string, trackingMessage: string, createdAt: string) {
    await db.insert(orderTrackingTable).values({
        orderId: orderId,
        trackingMessage: trackingMessage,
        createdAt: new Date(createdAt),
    });
}

const steadfastStatusesMap: Record<string, string> = {
    'pending': 'shipped',
    'delivered': 'delivered',
    'partial_delivered': 'partially_delivered',
    'cancelled': 'cancelled',
};

export async function POST(
    request: NextRequest,
    {params}: { params: Promise<{ merchantId: string }> }
) {
    const {merchantId} = await params
    const requestBody: DeliveryStatus | TrackingUpdate = await request.json();

    let orderId: string | undefined = requestBody.invoice;
    if (!orderId) {
        const consignmentId = requestBody.consignment_id;
        orderId = (await db
            .query
            .orderTable
            .findFirst({
                columns: {id: true},
                where: and(
                    eq(orderTable.consignmentsId, consignmentId.toString()),
                    eq(orderTable.merchantId, merchantId)
                ),
            }))?.id;

        if (!orderId) {
            console.error(`Order not found for consignment ID: ${consignmentId} and merchant ID: ${merchantId}`);
            return NextResponse.json({status: 'error', message: 'Order not found.'}, {status: 404});
        }
    }

    if (requestBody.notification_type === 'delivery_status') {
        const deliveryStatus = requestBody as DeliveryStatus;
        console.log('Processing delivery status update:', deliveryStatus);

        const status = deliveryStatus.status;
        const consignmentId = deliveryStatus.consignment_id;
        console.log(`Updating consignment ID: ${consignmentId} to status: ${status}`);

        // Update status
        const mappedStatus = steadfastStatusesMap[status];
        if (mappedStatus) {
            await updateStatus(consignmentId, mappedStatus as (typeof ORDER_STATUS)[number]['value'], merchantId);
        } else {
            console.warn(`Received unknown status: ${status} for consignment ID: ${consignmentId}`);
            return NextResponse.json({status: 'error', message: 'Unknown status received.'}, {status: 400});
        }

        // Insert tracking info
        const trackingMessage = deliveryStatus.tracking_message;
        await insertTracking(orderId, trackingMessage, deliveryStatus.updated_at);
    } else if (requestBody.notification_type === 'tracking_update') {
        const trackingUpdate = requestBody as TrackingUpdate;
        console.log('Processing tracking update:', trackingUpdate);

        const trackingMessage = trackingUpdate.tracking_message;

        // Insert tracking info
        await insertTracking(orderId, trackingMessage, trackingUpdate.updated_at);
    } else {
        return NextResponse.json({status: 'error', message: 'Unknown notification type.'}, {status: 400});
    }

    return NextResponse.json({status: 'success', message: 'Webhook received successfully.'});
}