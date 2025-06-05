const {Worker} = require('bullmq');
const IORedis = require('ioredis');
const fs = require('fs');
const crypto = require('crypto');
const filesDb = require('../data-access').filesDb;
const config = require('../config');

const connection = new IORedis(config.redis.url, {maxRetriesPerRequest: null});

const worker = new Worker('file-processing', async (job) => {
  const {fileId, filePath} = job.data;
  try {
    // Update status to 'processing'
    await filesDb.updateFileStatus(fileId, 'processing');

    // Simulate processing delay
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds

    // Calculate file hash
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Update DB with result
    await filesDb.updateFileProcessed(fileId, {
      status: 'processed',
      extractedData: hash,
    });
    return {hash};
  } catch (err) {
    await filesDb.updateFileStatus(fileId, 'failed');
    throw err;
  }
}, {connection});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
