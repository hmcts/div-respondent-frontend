const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { cloneDeep } = require('lodash');
const config = require('config');
const proxyquire = require('proxyquire');

const modulePath = 'middleware/setupSecretsMiddleware';
// const setupSecretsMiddleware = require(modulePath);

const req = {};
const res = {};
let next = {};
let mockConfig = {};

const app = {};

describe(modulePath, () => {
  describe('#setup', () => {
    beforeEach(() => {
      next = sinon.stub();
      mockConfig = cloneDeep(config);
      app.use = sinon.stub();
    });

    it('should set config values when secrets path is set', () => {
      mockConfig.secrets = {
        div: {
          'session-secret': 'sessionValue',
          'redis-secret': 'redisValue',
          'idam-secret': 'idamValue'
        }
      };

      // Update config with secret setup
      const setupSecretsMiddleware = proxyquire(modulePath,
        { config: mockConfig });
      setupSecretsMiddleware(app);

      const middleware = app.use.firstCall.args[0];
      middleware(req, res, next);

      expect(mockConfig.session.secret)
        .to.equal(mockConfig.secrets.div['session-secret']);
      expect(mockConfig.services.redis.encryptionAtRestKey)
        .to.equal(mockConfig.secrets.div['redis-secret']);
      expect(mockConfig.services.idam.secret)
        .to.equal(mockConfig.secrets.div['idam-secret']);
      expect(next.calledOnce).to.eql(true);
    });

    it('should not set config values when secrets path is not set', () => {
      // Update config with secret setup
      const setupSecretsMiddleware = proxyquire(modulePath,
        { config: mockConfig });
      setupSecretsMiddleware(app);

      const middleware = app.use.firstCall.args[0];
      middleware(res, res, next);

      expect(mockConfig.session.secret)
        .to.equal(config.session.secret);
      expect(mockConfig.services.redis.encryptionAtRestKey)
        .to.equal(config.services.redis.encryptionAtRestKey);
      expect(mockConfig.services.idam.secret)
        .to.equal(config.services.idam.secret);
      expect(next.calledOnce).to.eql(true);
    });

    it('should only set one config value when single secret path is set', () => {
      mockConfig.secrets = { div: { 'idam-secret': 'idamValue' } };

      // Update config with secret setup
      const setupSecretsMiddleware = proxyquire(modulePath,
        { config: mockConfig });
      setupSecretsMiddleware(app);

      const middleware = app.use.firstCall.args[0];
      middleware(req, res, next);

      expect(mockConfig.session.secret)
        .to.equal(config.session.secret);
      expect(mockConfig.services.redis.encryptionAtRestKey)
        .to.equal(config.services.redis.encryptionAtRestKey);
      expect(mockConfig.services.idam.secret)
        .to.not.equal(config.services.idam.secret);
      expect(mockConfig.services.idam.secret)
        .to.equal(mockConfig.secrets.div['idam-secret']);
      expect(next.calledOnce).to.eql(true);
    });
  });
});