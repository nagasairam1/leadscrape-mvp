import { FastifyInstance } from 'fastify';
import { Queue } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

export default async function (fastify: FastifyInstance) {
  const jobQueue = new Queue('jobs', { connection: { url: redisUrl } });

  fastify.post('/jobs', async (req, reply) => {
    // TODO: validate JWT, extract userId
    const userId = 'demo-user-id'; // ← replace with req.user.id after auth
    const { flowId, input } = req.body as { flowId: string; input: any };

    if (flowId !== 'linkedin-scrape-v1') {
      return reply.code(400).send({ error: 'Invalid flowId' });
    }

    // TODO: check user credits / plan limits

    const job = await jobQueue.add('run', { flowId, input, userId }, {
      attempts: 2,
      backoff: { type: 'exponential', delay: 5000 }
    });

    // Save to DB
    await fastify.prisma.job.create({
      data: {
        id: BigInt(job.id),
        userId,
        flowId,
        input
      }
    });

    return reply.code(201).send({ id: job.id });
  });

  fastify.get('/jobs/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const job = await fastify.prisma.job.findUnique({ where: { id: BigInt(id) } });
    if (!job) return reply.code(404).send({ error: 'Job not found' });
    return job;
  });
}
