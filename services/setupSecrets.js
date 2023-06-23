const config = require('@hmcts/properties-volume').addTo(require('config'));
const { get, set } = require('lodash');

const setSecret = (secretPath, configPath) => {
  // Only overwrite the value if the secretPath is defined
  if (config.has(secretPath)) {
    set(config, configPath, get(config, secretPath));
  }
};

const setupSecrets = () => {
  if (config.has('secrets.div')) {
    setSecret('secrets.div.session-secret', 'session.secret');
    setSecret('secrets.div.redis-connection-string', 'services.redis.url');
    setSecret('secrets.div.redis-secret', 'services.redis.encryptionAtRestKey');
    setSecret('secrets.div.idam-secret', 'services.idam.secret');
    setSecret('secrets.div.os-places-token', 'services.postcode.token');
    setSecret('secrets.div.AppInsightsInstrumentationKey', 'services.applicationInsights.instrumentationKey');
    setSecret('secrets.div.launchdarkly-key', 'featureToggles.launchDarklyKey');
    setSecret('secrets.div.pcq-token-key', 'services.equalityAndDiversity.tokenKey');
  }
};

module.exports = setupSecrets;
