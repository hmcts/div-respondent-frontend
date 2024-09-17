const ioRedis = require('ioredis');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');
const logger = require('services/logger').getLogger(__filename);

const pingInterval = 60000;

const client = ioRedis.createClient(
  process.env.REDIS_URL || config.services.redis.url
);

client.on('connect', () => {
  logger.infoWithReq(null, 'redis_connect', 'Connected to Redis');
});

client.on('error', error => {
  logger.errorWithReq(null, 'redis_error', 'Error connecting to Redis', error);
});

function pingRedis() {
  logger.infoWithReq(null, 'redis_connect', 'redisClient => Sending Ping...');
  client.ping();
}

if (parseBool(config.features.pingRedis)) {
  setInterval(pingRedis, pingInterval);
}

module.exports = client;
