const {Queue} = require('bullmq');
const IORedis = require('ioredis');
const config = require('../config');

const connection = new IORedis(config.redis.url);

const fileProcessingQueue = new Queue('file-processing', {connection});

module.exports = fileProcessingQueue;
