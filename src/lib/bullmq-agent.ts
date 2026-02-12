import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

// Facebook Business SDK
import bizSdk from "facebook-nodejs-business-sdk"

// Send mail
import { sendEmail } from "@/lib/mail/incomplete-order/send-email";
import { sendOrderConfirmationEmail } from "@/lib/mail/order-confirmation/send-email";

// db
import db from '@/lib/drizzle-agent';
import { orderTable } from '@/db/index.schema';
import { eq } from 'drizzle-orm';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
    console.error('Redis connection error:', err);
});

connection.on('connect', () => {
    console.log('Connected to Redis');
});


export const myQueue = new Queue('my-queue', {connection});
export const incompleteOrderQueue = new Queue('incomplete-order-queue', {connection});
export const orderConfirmationQueue = new Queue('order-confirmation-queue', {connection});
export const facebookEventQueue = new Queue('facebook-event-queue', {connection});

// Only initialize worker in a dedicated background job handler
let myWorker: Worker | null = null;
let incompleteOrderWorker: Worker | null = null;
let orderConfirmationWorker: Worker | null = null;
let facebookEventWorker: Worker | null = null;

export async function initializeWorker() {
    if (myWorker && incompleteOrderWorker && orderConfirmationWorker && facebookEventWorker) {
        console.log('Workers already initialized');
        return;
    }

    // Initialize my-queue worker
    if (!myWorker) {
        myWorker = new Worker('my-queue', async job => {
            console.log('Processing my-queue job:', job.id, 'with data:', job.data);
            if (job.name === 'facebook-event-task') {
                console.log('Executing facebook event task with params:', job.data);
                // Simulate task processing
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Completed my-queue job:', job.id);
            return {processed: true, jobId: job.id};
        }, {
            connection: connection.duplicate(),
            concurrency: 5,
        });

        myWorker.on('failed', (job, err) => {
            console.error(`my-queue Job ${job?.id} failed:`, err);
        });

        myWorker.on('completed', (job) => {
            console.log(`my-queue Job ${job.id} completed successfully`);
        });

        myWorker.on('error', (err) => {
            console.error('my-queue Worker error:', err);
        });

        myWorker.on('ready', () => {
            console.log('my-queue Worker is ready and listening for jobs');
        });
    }

    // Initialize incomplete-order-queue worker
    if (!incompleteOrderWorker) {
        incompleteOrderWorker = new Worker('incomplete-order-queue', async job => {
            console.log('Processing incomplete-order-queue job:', job.id, 'with data:', job.data);
            await sendEmail({
                merchantName: job.data.merchantName,
                merchantEmail: job.data.merchantEmail,
                orderId: job.data.orderId,
                createdDate: job.data.createdDate,
                supportEmail: job.data.supportEmail,
                storeName: job.data.storeName,
                phoneNumber: job.data.phoneNumber,
            });
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Completed incomplete-order-queue job:', job.id);
            return {emailSent: true, jobId: job.id};
        }, {
            connection: connection.duplicate(),
            concurrency: 3,
        });

        incompleteOrderWorker.on('failed', (job, err) => {
            console.error(`incomplete-order-queue Job ${job?.id} failed:`, err);
        });

        incompleteOrderWorker.on('completed', (job) => {
            console.log(`incomplete-order-queue Job ${job.id} completed successfully`);
        });

        incompleteOrderWorker.on('error', (err) => {
            console.error('incomplete-order-queue Worker error:', err);
        });

        incompleteOrderWorker.on('ready', () => {
            console.log('incomplete-order-queue Worker is ready and listening for jobs');
        });
    }

    // Initialize order-confirmation-queue worker
    if (!orderConfirmationWorker) {
        orderConfirmationWorker = new Worker('order-confirmation-queue', async job => {
            console.log('Processing order-confirmation-queue job:', job.id, 'with data:', job.data);
            const result = await sendOrderConfirmationEmail({
                customerName: job.data.customerName,
                customerEmail: job.data.customerEmail,
                orderNumber: job.data.orderNumber,
                createdDate: job.data.createdDate,
                phoneNumber: job.data.phoneNumber,
                storeName: job.data.storeName,
                supportEmail: job.data.supportEmail,
                shippingFullName: job.data.shippingFullName,
                shippingAddressLine1: job.data.shippingAddressLine1,
                shippingCity: job.data.shippingCity,
                shippingPostalCode: job.data.shippingPostalCode,
                shippingCountry: job.data.shippingCountry,
                shippingPhone: job.data.shippingPhone,
                subtotalAmount: job.data.subtotalAmount,
                shippingAmount: job.data.shippingAmount,
                discountAmount: job.data.discountAmount,
                totalAmount: job.data.totalAmount,
                currency: job.data.currency,
                items: job.data.items,
            });
            console.log('Completed order-confirmation-queue job:', job.id);
            return {emailSent: result.success, jobId: job.id};
        }, {
            connection: connection.duplicate(),
            concurrency: 3,
            stalledInterval: 30000,
        });

        orderConfirmationWorker.on('failed', (job, err) => {
            console.error(`order-confirmation-queue Job ${job?.id} failed:`, err);
        });

        orderConfirmationWorker.on('completed', (job) => {
            console.log(`order-confirmation-queue Job ${job.id} completed successfully`);
        });

        orderConfirmationWorker.on('error', (err) => {
            console.error('order-confirmation-queue Worker error:', err);
        });

        orderConfirmationWorker.on('ready', () => {
            console.log('order-confirmation-queue Worker is ready and listening for jobs');
        });
    }

    // Initialize facebook-event-queue worker
    if (!facebookEventWorker) {
        facebookEventWorker = new Worker('facebook-event-queue', async (job: Job) => {
            const accessToken = job.data.accessToken
            const pixelId = job.data.pixelId

            const ServerEvent = bizSdk.ServerEvent;
            const EventRequest = bizSdk.EventRequest;
            const UserData = bizSdk.UserData;
            const CustomData = bizSdk.CustomData;
            // const Content = bizSdk.Content;
            // const api = bizSdk.FacebookAdsApi.init(access_token);

            let serverEvent_0;

            if (job.name == 'Purchase') {
                const orderId = job.data.orderId;
                const orderDetails = await db
                    .query
                    .orderTable
                    .findFirst({
                        with: {
                            items: {
                                columns: {
                                    id: true,
                                }
                            },
                            customer: {
                                columns: {
                                    id: true,
                                    fbLoginId: true,
                                }
                            }
                        },
                        where: eq(orderTable.id, orderId),
                        columns: {
                            id: true,
                            shippingFullName: true,
                            totalAmount: true,
                            currency: true,
                            shippingPhone: true,
                            actionSource: true,
                            eventSourceUrl: true,
                            shippingCity: true,
                            shippingDivision: true,
                            shippingPostalCode: true,
                            ipAddress: true,
                            userAgent: true,
                            fbc: true,
                            fbp: true,
                            createdAt: true,
                        },
                    });

                if (!orderDetails) {
                    throw new Error('Order not found for id: ' + orderId);
                }

                const userData_0 = (new UserData())
                    .setFirstName(orderDetails.shippingFullName.split(' ')[0])
                    .setLastName(orderDetails.shippingFullName.split(' ').slice(1).join(' '))
                    .setPhones([orderDetails.shippingPhone])
                    .setCity(orderDetails.shippingCity)
                    .setState(orderDetails.shippingDivision || '')
                    .setZip(orderDetails.shippingPostalCode || '')
                    .setCountry('bd')
                    .setExternalId(orderDetails.customer.id)
                    .setClientIpAddress(orderDetails.ipAddress)
                    .setClientUserAgent(orderDetails.userAgent)
                    .setFbc(orderDetails.fbc || '')
                    .setFbp(orderDetails.fbp)
                    .setFbLoginId(orderDetails.customer.fbLoginId || '');
                const customData_0 = (new CustomData())
                    .setValue(orderDetails.totalAmount)
                    .setCurrency(orderDetails.currency)
                    .setContentType("product")
                    .setContentIds(orderDetails.items.map(item => item.id))
                    .setNumItems(orderDetails.items.length);
                serverEvent_0 = (new ServerEvent())
                    .setEventId(orderDetails.id)
                    .setEventName('Purchase')
                    .setOptOut(false)
                    .setActionSource(orderDetails.actionSource)
                    .setEventTime(Math.trunc(orderDetails.createdAt.getTime() / 1000))
                    .setEventSourceUrl(orderDetails.eventSourceUrl)
                    .setUserData(userData_0)
                    .setCustomData(customData_0);
            }

            if(serverEvent_0 === undefined) {
                throw new Error('No server event created for job');
            }
            console.log(serverEvent_0);

            const eventsData = [serverEvent_0];
            const eventRequest = (new EventRequest(accessToken, pixelId))
                .setEvents(eventsData)
                // .setTestEventCode("TEST61190")
                .setDebugMode(true);

            await eventRequest.execute();

            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Completed facebook-event-queue job:', job.id);
            return {eventProcessed: true, jobId: job.id};
        }, {
            connection: connection.duplicate(),
            concurrency: 5,
        });

        facebookEventWorker.on('failed', (job, err) => {
            console.error(`facebook-event-queue Job ${job?.id} failed:`, err);
        });

        facebookEventWorker.on('completed', (job) => {
            console.log(`facebook-event-queue Job ${job.id} completed successfully`);
        });

        facebookEventWorker.on('error', (err) => {
            console.error('facebook-event-queue Worker error:', err);
        });

        facebookEventWorker.on('ready', () => {
            console.log('facebook-event-queue Worker is ready and listening for jobs');
        });
    }

    console.log('All workers initialized successfully');
}

export async function closeWorker() {
    const closingPromises = [];

    if (myWorker) {
        console.log('Closing my-queue worker...');
        closingPromises.push(myWorker.close());
        myWorker = null;
    }

    if (incompleteOrderWorker) {
        console.log('Closing incomplete-order-queue worker...');
        closingPromises.push(incompleteOrderWorker.close());
        incompleteOrderWorker = null;
    }

    if (orderConfirmationWorker) {
        console.log('Closing order-confirmation-queue worker...');
        closingPromises.push(orderConfirmationWorker.close());
        orderConfirmationWorker = null;
    }

    if (facebookEventWorker) {
        console.log('Closing facebook-event-queue worker...');
        closingPromises.push(facebookEventWorker.close());
        facebookEventWorker = null;
    }

    await Promise.all(closingPromises);
    console.log('All workers closed successfully');
}