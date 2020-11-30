const CaptureCaseAndPinPage = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const content = require('steps/capture-case-and-pin/CaptureCaseAndPin.content');
const idamConfigHelper = require('test/e2e/helpers/idamConfigHelper.js');
const caseConfigHelper = require('test/e2e//helpers/caseConfigHelper.js');

function seeCaptureCaseAndPinPage(language = 'en') {
  const I = this;
  I.waitInUrl(CaptureCaseAndPinPage.path, 45);
  I.seeCurrentUrlEquals(CaptureCaseAndPinPage.path);
  I.waitForText(content[language].title);
}

function fillInReferenceNumberAndPinCode(referenceNumber, pinCode) {
  const I = this;

  I.fillField('referenceNumber', referenceNumber || caseConfigHelper.getTestCaseId());
  I.fillField('securityAccessCode', pinCode || idamConfigHelper.getPin());
}

module.exports = { seeCaptureCaseAndPinPage, fillInReferenceNumberAndPinCode };
