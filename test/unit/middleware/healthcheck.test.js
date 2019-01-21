const modulePath = 'middleware/healthcheck';

const setupHealthChecks = require(modulePath);
const path = require('path');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const logger = require('@hmcts/nodejs-logging')
  .Logger.getLogger(path.resolve('middleware/healthcheck.js'));
const { sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const { OK } = require('http-status-codes');
const redis = require('services/redis');

const app = {};
let res = {};

describe(modulePath, () => {
  beforeEach(() => {
    app.use = sinon.stub();
    sinon.stub(redis, 'ping').resolves('PONG');
    sinon.stub(healthcheck, 'web');
    sinon.stub(healthcheck, 'raw');
    sinon.stub(healthcheck, 'status');
    sinon.stub(logger, 'error');
    sinon.stub(outputs, 'up');
    res = { status: OK };
  });

  afterEach(() => {
    redis.ping.restore();
    healthcheck.web.restore();
    healthcheck.raw.restore();
    healthcheck.status.restore();
    logger.error.restore();
    outputs.up.restore();
  });

  it('set a middleware on the healthcheck endpoint', () => {
    setupHealthChecks(app);
    sinon.assert.calledWith(app.use, config.paths.health);
  });

  it('throws an error if healthcheck fails for redis', done => {
    redis.ping.rejects('error');
    setupHealthChecks(app);

    const rawPromise = healthcheck.raw.firstCall.args[0];
    rawPromise()
      .then(() => {
        sinon.assert.calledWith(logger.error, 'Health check failed on redis: error');
      })
      .then(done, done);
  });

  it('passes healthcheck for redis if redis is running', done => {
    setupHealthChecks(app);

    const rawPromise = healthcheck.raw.firstCall.args[0];
    rawPromise()
      .then(() => {
        sinon.assert.calledWith(healthcheck.status, true);
      })
      .then(done, done);
  });

  it('returns up if healthcheck passes for idam-auth', () => {
    setupHealthChecks(app);

    const idamCallback = healthcheck.web.firstCall.args[1].callback;
    idamCallback(null, res);

    sinon.assert.called(outputs.up);
  });

  it('throws an error if healthcheck fails for idam-auth', () => {
    setupHealthChecks(app);

    const idamCallback = healthcheck.web.firstCall.args[1].callback;
    idamCallback('error');

    sinon.assert.calledWith(logger.error,
      { error: 'error', message: 'Health check failed on idam-auth:' }
    );
  });

  it('throws an error if healthcheck fails for idam-api', () => {
    setupHealthChecks(app);

    const idamCallback = healthcheck.web.secondCall.args[1].callback;
    idamCallback('error');

    sinon.assert.calledWith(logger.error,
      { error: 'error', message: 'Health check failed on idam-api:' }
    );
  });

  it('returns up if healthcheck passes for idam-api', () => {
    setupHealthChecks(app);

    const idamCallback = healthcheck.web.secondCall.args[1].callback;
    idamCallback('error');

    sinon.assert.calledWith(logger.error,
      { error: 'error', message: 'Health check failed on idam-api:' }
    );
  });

  describe('case-orchestration-service', () => {
    it('passes healthcheck', () => {
      setupHealthChecks(app);

      const cosCallback = healthcheck.web.thirdCall.args[1].callback;
      cosCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if healthcheck fails for case-orchestration-service', () => {
      setupHealthChecks(app);

      const cosCallback = healthcheck.web.thirdCall.args[1].callback;
      cosCallback('error');

      sinon.assert.calledWith(
        logger.error,
        { error: 'error', message: 'Health check failed on case-orchestration-service:' }
      );
    });
  });

  describe('fees-and-payments service', () => {
    it('passes healthcheck', () => {
      setupHealthChecks(app);

      const feesCallback = healthcheck.web.lastCall.args[1].callback;
      feesCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if healthcheck fails for fees-and-payments', () => {
      setupHealthChecks(app);

      const feesCallback = healthcheck.web.lastCall.args[1].callback;
      feesCallback('error');

      sinon.assert.calledWith(
        logger.error,
        { error: 'error', message: 'Health check failed on fees-and-payments:' }
      );
    });
  });
});
