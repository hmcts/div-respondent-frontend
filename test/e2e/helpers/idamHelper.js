const config = require('config');
const logger = require('services/logger').getLogger(__filename);
const randomstring = require('randomstring');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');
const idamConfigHelper = require('./idamConfigHelper');
const Helper = codecept_helper; // eslint-disable-line

const redirectUri = `${config.tests.e2e.url}${config.paths.authenticated}`;
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
    const randomString = randomstring.generate({
      length: 16,
      charset: 'numeric'
    });
    const emailName = `divorce+rfe-test-${randomString}`;
    const testEmail = `${emailName}@mailinator.com`;
    const testPassword = 'genericPassword123';

    idamArgs.testEmail = testEmail;
    idamArgs.testPassword = testPassword;
    idamArgs.testGroupCode = 'citizens';
    idamArgs.roles = [{ code: 'citizen' }, { code: 'caseworker-divorce-courtadmin' }];

    idamConfigHelper.setTestEmail(testEmail);
    idamConfigHelper.setTestPassword(testPassword);
    return idamExpressTestHarness.createUser(idamArgs, null)
      .then(() => {
        logger.infoWithReq(null, 'idam_user_created', 'Created IDAM test user', testEmail);
        return idamExpressTestHarness.getToken(idamArgs, null);
      })
      .then(response => {
        logger.infoWithReq(null, 'idam_user_created', 'Retrieved IDAM test user token', testEmail);
        idamConfigHelper.setTestToken(response.access_token);
        idamArgs.accessToken = response.access_token;
        return idamExpressTestHarness.generatePin(idamArgs, null);
      })
      .then(response => {
        logger.infoWithReq(null, `Retrieved IDAM test user pin: ${testEmail}`);
        if (!idamConfigHelper.getPin()) {
          idamConfigHelper.setLetterHolderId(response.userId);
          idamConfigHelper.setPin(response.pin);
        }
      })
      .catch(error => {
        logger.errorWithReq(
          null,
          'idam_error',
          'Unable to create IDAM test user/token',
          error.message
        );
        throw error;
      });
  }

  _after() {
    const MAX_ATTEMPTS = 3;

    const removeUserAccount = attempts => {
      logger.infoWithReq(null, 'removing_idam_user', 'Removing IDAM test user...');
      const testEmail = idamArgs.testEmail;
      idamExpressTestHarness.removeUser(idamArgs, null)
        .then(() => {
          logger.infoWithReq(null, 'idam_user_removed', 'Removed IDAM test user', testEmail);
        })
        .catch(error => {
          logger.warnWithReq(
            null,
            'idam_error',
            `Unable to remove IDAM test user  + ${attempts}`,
            error.message
          );
          if (attempts < MAX_ATTEMPTS) {
            removeUserAccount(attempts + 1);
          } else {
            logger.warnWithReq(
              null,
              'idam_error',
              'Unable to remove IDAM test user too many times. TEST BROKEN',
              error.message
            );
          }
        });
    };

    removeUserAccount(1);
  }
}

module.exports = IdamHelper;
