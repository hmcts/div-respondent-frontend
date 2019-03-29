const config = require('config');
const { get, set } = require('lodash');
const logger = require('services/logger').getLogger(__filename);

const setSecret = (secretPath, configPath) => {
  // Only overwrite the value if the secretPath is defined
  if (config.has(secretPath)) {
    set(config, configPath, get(config, secretPath));
  }
};

const setup = (req, res, next) => {
  // Property Volumes will be the correct format to use in the future, so it will take precendence
  const configStr = JSON.stringify(config);

  if (config.has('secrets.div')) {
    logger.infoWithReq(req, 'setupConfig', 'Setted', configStr);

    setSecret('secrets.div.session-secret', 'session.secret');
    setSecret('secrets.div.redis-secret', 'services.redis.encryptionAtRestKey');
    setSecret('secrets.div.idam-secret', 'services.idam.secret');
  } else {
    logger.infoWithReq(req, 'setupConfig', 'Not setted', configStr);
  }

  next();
};

const setupSecrets = app => {
  app.use(setup);
};

module.exports = setupSecrets;