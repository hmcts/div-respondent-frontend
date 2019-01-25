const ioRedis = require('ioredis');
const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const client = ioRedis.createClient(
  config.services.redis.url,
  { enableOfflineQueue: false }
);
client.on('error', error => {
  logger.error(null, 'redis_error', 'Error connecting to Redis', error);
});

module.exports = client;
