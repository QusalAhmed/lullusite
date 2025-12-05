import {initializeWorker} from '@/lib/bullmq-agent';

export async function register(){
    await initializeWorker();
}