const config = require('config');
const redis = require('./redis');
const expressLimiter = require('express-limiter');

const { parseBool } = require('@hmcts/one-per-page/util');

module.exports = app => {
  if (!parseBool(config.services.rateLimiter.enabled)) {
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
