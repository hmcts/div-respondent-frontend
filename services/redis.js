const ioRedis = require('ioredis');
const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const client = ioRedis.createClient(
  process.env.REDIS_URL || config.services.redis.url
);
client.on('error', error => {
  logger.errorWithReq(null, 'redis_error', 'Error connecting to Redis', error);
});

module.exports = client;
