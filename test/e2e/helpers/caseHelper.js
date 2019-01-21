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
      .then(response => {
        logger.info('case_created', 'Case created', response.id, idamConfigHelper.getTestEmail());
        caseConfigHelper.setTestCaseId(response.id);
      })
      .catch(error => {
        logger.error('create_case_error', 'Error creating case', error.message);
        throw error;
      });
  }
}

module.exports = CaseHelper;
