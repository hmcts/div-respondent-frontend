const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const randomstring = require('randomstring');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');
const idamConfigHelper = require('./idamConfigHelper');

const Helper = codecept_helper; // eslint-disable-line

const redirectUri = `${config.node.baseUrl}${config.paths.authenticated}`;
const idamArgs = {
  redirectUri,
  indexUrl: config.paths.index,
  idamApiUrl: config.services.idam.apiUrl,
  idamLoginUrl: config.services.idam.loginUrl,
  idamSecret: config.services.idam.secret,
  idamClientID: config.services.idam.clientId
};

class IdamHelper extends Helper {
  _before() {
    if (config.environment !== 'development') {
      const randomString = randomstring.generate({
        length: 16,
        charset: 'numeric'
      });
      const emailName = `simulate-delivered-${randomString}`;
      const testEmail = `${emailName}@notifications.service.gov.uk`;
      const testPassword = randomstring.generate(9);

      idamArgs.testEmail = testEmail;
      idamArgs.testPassword = testPassword;

      idamConfigHelper.setTestEmail(testEmail);
      idamConfigHelper.setTestPassword(testPassword);

      idamExpressTestHarness.createUser(idamArgs)
        .then(() => {
          logger.info(`Created IDAM test user: ${testEmail}`);
        })
        .catch(error => {
          logger.warn(`Unable to create IDAM test user: ${error}`);
        });
    }
  }

  _after() {
    if (config.environment !== 'development') {
      idamExpressTestHarness.removeUser(idamArgs)
        .then(() => {
          logger.info(`Removed IDAM test user: ${idamArgs.testEmail}`);
        })
        .catch(error => {
          logger.warn(`Unable to remove IDAM test user: ${error}`);
        });
    }
  }
}

module.exports = IdamHelper;
