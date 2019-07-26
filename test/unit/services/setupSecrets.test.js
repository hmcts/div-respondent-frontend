const { expect } = require('@hmcts/one-per-page-test-suite');
const { cloneDeep } = require('lodash');
const config = require('config');
const proxyquire = require('proxyquire');

const modulePath = 'services/setupSecrets';

let mockConfig = {};

describe(modulePath, () => {
  describe('#setup', () => {
    beforeEach(() => {
      mockConfig = cloneDeep(config);
    });

    it('should set config values when secrets path is set', () => {
      mockConfig.secrets = {
        div: {
          'session-secret': 'sessionValue',
          'redis-secret': 'redisValue',
          'idam-secret': 'idamValue',
          'os-places-token': 'osPlacesValue'
        }
      };

      // Update config with secret setup
      const setupSecrets = proxyquire(modulePath,
        { config: mockConfig });
      setupSecrets();

      expect(mockConfig.session.secret)
        .to.equal(mockConfig.secrets.div['session-secret']);
      expect(mockConfig.services.redis.encryptionAtRestKey)
        .to.equal(mockConfig.secrets.div['redis-secret']);
      expect(mockConfig.services.idam.secret)
        .to.equal(mockConfig.secrets.div['idam-secret']);
      expect(mockConfig.services.postcode.token)
        .to.equal(mockConfig.secrets.div['os-places-token']);
    });

    it('should not set config values when secrets path is not set', () => {
      // Update config with secret setup
      const setupSecrets = proxyquire(modulePath,
        { config: mockConfig });
      setupSecrets();

      expect(mockConfig.session.secret)
        .to.equal(config.session.secret);
      expect(mockConfig.services.redis.encryptionAtRestKey)
        .to.equal(config.services.redis.encryptionAtRestKey);
      expect(mockConfig.services.idam.secret)
        .to.equal(config.services.idam.secret);
    });

    it('should only set one config value when single secret path is set', () => {
      mockConfig.secrets = { div: { 'idam-secret': 'idamValue' } };

      // Update config with secret setup
      const setupSecrets = proxyquire(modulePath,
        { config: mockConfig });
      setupSecrets();

      expect(mockConfig.session.secret)
        .to.equal(config.session.secret);
      expect(mockConfig.services.redis.encryptionAtRestKey)
        .to.equal(config.services.redis.encryptionAtRestKey);
      expect(mockConfig.services.idam.secret)
        .to.not.equal(config.services.idam.secret);
      expect(mockConfig.services.idam.secret)
        .to.equal(mockConfig.secrets.div['idam-secret']);
    });
  });
});