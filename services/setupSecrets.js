const config = require('@hmcts/properties-volume').addTo(require('config'));
const { get, set } = require('lodash');
const logger = require('services/logger').getLogger(__filename);

const setSecret = (secretPath, configPath) => {
  // Only overwrite the value if the secretPath is defined
  if (config.has(secretPath)) {
    set(config, configPath, get(config, secretPath));
  }
};

const setupSecrets = () => {
  logger.infoWithReq(null, 'dev', 'setting up secrets');
  if (config.has('secrets.div')) {
    logger.infoWithReq(null, 'dev', 'setting up secrets.div');
    logger.infoWithReq(null, 'dev', get(config, 'secrets.div.redis-connection-string'));
    setSecret('secrets.div.session-secret', 'session.secret');
    setSecret('secrets.div.redis-connection-string', 'services.redis.url');
    setSecret('secrets.div.redis-secret', 'services.redis.encryptionAtRestKey');
    setSecret('secrets.div.idam-secret', 'services.idam.secret');
    setSecret('secrets.div.os-places-token', 'services.postcode.token');
    setSecret('secrets.div.AppInsightsInstrumentationKey', 'services.applicationInsights.instrumentationKey');
    setSecret('secrets.div.launchdarkly-key', 'featureToggles.launchDarklyKey');
    setSecret('secrets.div.pcq-token-key', 'services.equalityAndDiversity.tokenKey');
  } else {
    logger.infoWithReq(null, 'dev', 'missing setting up secrets.div');
  }
};

module.exports = setupSecrets;
