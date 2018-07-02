const config = require('config');
const redis = require('./redis');
const expressLimiter = require('express-limiter');

module.exports = app => {
  if (!config.services.rateLimiter.enabled) {
    return false;
  }

  const limiter = expressLimiter(app, redis);

  return limiter({
    lookup: ['connection.remoteAddress'],
    // 150 requests per hour
    total: config.services.rateLimiter.total,
    expire: config.services.rateLimiter.expire
  });
};
