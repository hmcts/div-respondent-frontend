const config = require('config');
const ioRedis = require('ioredis');
const IoRedisMock = require('ioredis-mock');
const sinon = require('sinon');

const mockRedisClient = new IoRedisMock(config.services.redis.url);

// Not in a before block because this stub must occur before loading any other test file
sinon.stub(ioRedis, 'createClient').returns(mockRedisClient);

after(() => {
  ioRedis.createClient.restore();
});