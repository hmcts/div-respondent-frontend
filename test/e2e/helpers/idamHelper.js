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
  createAUser() {
    if (config.features.idam) {
      const randomString = randomstring.generate({
        length: 16,
        charset: 'numeric'
      });
      const emailName = `simulate-delivered-${randomString}`;
      const testEmail = `${emailName}@notifications.service.gov.uk`;
      const testPassword = randomstring.generate(9);

      idamArgs.testEmail = testEmail;
      idamArgs.testPassword = testPassword;
      idamArgs.testGroupCode = 'caseworker';
      idamArgs.roles = ['citizen', 'caseworker-divorce-courtadmin'];

      idamConfigHelper.setTestEmail(testEmail);
      idamConfigHelper.setTestPassword(testPassword);
      return idamExpressTestHarness.createUser(idamArgs, config.tests.e2e.proxy)
        .then(() => {
          logger.info(`Created IDAM test user: ${testEmail}`);
          return idamExpressTestHarness.getToken(idamArgs, config.tests.e2e.proxy);
        })
        .then(response => {
          logger.info(`Retrieved IDAM test user token: ${testEmail}`);
          idamConfigHelper.setTestToken(response.access_token);
          idamArgs.accessToken = response.access_token;
          return idamExpressTestHarness.generatePin(idamArgs, config.tests.e2e.proxy);
        })
        .then(response => {
          logger.info(`Retrieved IDAM test user pin: ${testEmail}`);
          if (!idamConfigHelper.getPin()) {
            idamConfigHelper.setLetterHolderId(response.userId);
            idamConfigHelper.setPin(response.pin);
          }
        })
        .catch(error => {
          logger.warn(`Unable to create IDAM test user/token: ${error}`);
          throw error;
        });
    }
    return Promise.resolve({});
  }

  _after() {
    if (config.features.idam) {
      idamExpressTestHarness.removeUser(idamArgs, config.tests.e2e.proxy)
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