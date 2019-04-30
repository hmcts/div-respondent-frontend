const modulePath = 'middleware/healthcheck';

const setupHealthChecks = require(modulePath);
const path = require('path');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const logger = require('@hmcts/nodejs-logging')
  .Logger.getLogger(path.resolve('middleware/healthcheck.js'));
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
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

  it('set a middleware on the health check endpoint', () => {
    setupHealthChecks(app);
    sinon.assert.calledWith(app.use, config.paths.health);
  });

  describe('redis', () => {
    it('throws an error if health check fails', done => {
      redis.ping.rejects('error');
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.getCall(0).args[0];
      rawPromise()
        .then(() => {
          sinon.assert.calledOnce(logger.error);
        })
        .then(done, done);
    });

    it('passes health check', done => {
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.getCall(0).args[0];
      rawPromise()
        .then(() => {
          sinon.assert.calledWith(healthcheck.status, true);
        })
        .then(done, done);
    });
  });

  describe('idam-api', () => {
    it('passes health check', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(0).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.idam.apiHealth);

      const idamCallback = callArgs[1].callback;
      idamCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if health check fails', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(0).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.idam.apiHealth);

      const idamCallback = callArgs[1].callback;
      idamCallback('error');

      sinon.assert.calledOnce(logger.error);
    });
  });

  describe('case-orchestration-service', () => {
    it('passes health check', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(1).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.caseOrchestration.health);

      const cosCallback = callArgs[1].callback;
      cosCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if health check fails for case-orchestration-service', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(1).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.caseOrchestration.health);

      const cosCallback = callArgs[1].callback;
      cosCallback('error');

      sinon.assert.calledOnce(logger.error);
    });
  });

  describe('fees-and-payments service', () => {
    it('passes health check', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(2).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.feesAndPayments.health);

      const feesCallback = callArgs[1].callback;
      feesCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if health check fails for fees-and-payments', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(2).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.feesAndPayments.health);

      const feesCallback = callArgs[1].callback;
      feesCallback('error');

      sinon.assert.calledOnce(logger.error);
    });
  });

  describe('evidence-management service', () => {
    it('passes health check', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(3).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.evidenceManagement.health);

      const evidenceManagementCallback = callArgs[1].callback;
      evidenceManagementCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if health check fails for evidence-management', () => {
      setupHealthChecks(app);

      const callArgs = healthcheck.web.getCall(3).args;

      // check we are testing correct service
      expect(callArgs[0]).to.eql(config.services.evidenceManagement.health);

      const evidenceManagementCallback = callArgs[1].callback;
      evidenceManagementCallback('error');

      sinon.assert.calledOnce(logger.error);
    });
  });
});
