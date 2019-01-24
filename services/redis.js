const ioRedis = require('ioredis');
const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const client = ioRedis.createClient(
  config.services.redis.url,
  { enableOfflineQueue: false }
);
client.on('error', error => {
  logger.error(error);
});

module.exports = client;
