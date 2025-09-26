import { Worker } from 'bullmq';
import { runLinkedInFlow } from './flows/linkedin-scrape';
import { PrismaClient } from '@prisma/client';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const prisma = new PrismaClient();

const worker = new Worker('jobs', async (job) => {
  const { flowId, input, userId } = job.data;

  await prisma.job.update({
    where: { id: BigInt(job.id) },
    data: { status: 'running' }
  });

  try {
    if (flowId === 'linkedin-scrape-v1') {
      const start = Date.now();
      const result = await runLinkedInFlow(input);
      const runtimeSeconds = Math.round((Date.now() - start) / 1000);

      await prisma.job.update({
        where: { id: BigInt(job.id) },
        data: { status: 'completed', outputUrl: result.url, runtimeSeconds }
      });

      // TODO: report usage to Stripe for metered billing
      return result;
    } else {
      throw new Error(`Unknown flow: ${flowId}`);
    }
  } catch (err: any) {
    await prisma.job.update({
      where: { id: BigInt(job.id) },
      data: { status: 'failed' }
    });
    throw err;
  }
}, { connection: { url: redisUrl } });

worker.on('completed', (job) => console.log(`✅ Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`❌ Job ${job?.id} failed:`, err.message));
