// import { Queue, Worker } from 'bullmq';
// import IORedis from 'ioredis';
//
// const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
//     maxRetriesPerRequest: null,
// });
//
// connection.on('error', (err) => {
//     console.error('Redis connection error:', err);
// });
//
// connection.on('connect', () => {
//     console.log('Connected to Redis');
// });
//
// export const myQueue = new Queue('my-queue', {connection});
//
// // Only initialize worker in a dedicated background job handler
// let myWorker: Worker | null = null;
//
// export async function initializeWorker() {
//     if (myWorker) return;
//
//     myWorker = new Worker('my-queue', async job => {
//         // Your job logic here
//         console.log('Processing job:', job.id);
//     }, {
//         connection,
//         concurrency: 5,
//     });
//
//     myWorker.on('failed', (job, err) => {
//         console.error(`Job ${job?.id} failed:`, err);
//     });
// }
//
// export async function closeWorker() {
//     if (myWorker) {
//         await myWorker.close();
//         myWorker = null;
//     }
// }