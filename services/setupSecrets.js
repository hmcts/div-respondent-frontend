const config = require('config');
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
    setSecret('secrets.div.redis-secret', 'services.redis.encryptionAtRestKey');
    setSecret('secrets.div.idam-secret', 'services.idam.secret');
  }
};

module.exports = setupSecrets;