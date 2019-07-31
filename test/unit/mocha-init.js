const config = require('config');
const ioRedis = require('ioredis');
const IoRedisMock = require('ioredis-mock');
const sinon = require('sinon');

const mockRedisClient = new IoRedisMock(config.services.redis.url);

sinon.stub(ioRedis, 'createClient').returns(mockRedisClient);