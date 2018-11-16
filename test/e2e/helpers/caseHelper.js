const util = require('util');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const config = require('config');
const idamConfigHelper = require('./idamConfigHelper');
const caseConfigHelper = require('./caseConfigHelper');
const divTestHarness = require('@hmcts/div-test-harness');

let Helper = codecept_helper; // eslint-disable-line

class CaseHelper extends Helper {
  createAosCaseForUser(caseData) {
    caseData.AosLetterHolderId = idamConfigHelper.getLetterHolderId();
    const params = {
      baseUrl: config.services.caseMaintenance.baseUrl,
      authToken: idamConfigHelper.getTestToken(),
      caseData
    };
    return divTestHarness.createAosCase(params, config.tests.e2e.proxy)
      .then(createCaseResponse => {
        logger.info(`Created AOS case ${createCaseResponse.id} for 
          ${idamConfigHelper.getTestEmail()}`);
        caseConfigHelper.setTestCaseId(createCaseResponse.id);
      })
      .catch(error => {
        logger.info(`Error creating case: ${util.inspect(error)}`);
        throw error;
      });
  }
}

module.exports = CaseHelper;
