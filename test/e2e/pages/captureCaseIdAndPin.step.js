const CaptureCaseAndPinPage = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const content = require('steps/capture-case-and-pin/CaptureCaseAndPin.content');
const idamConfigHelper = require('../helpers/idamConfigHelper');
const caseConfigHelper = require('../helpers/caseConfigHelper');

function seeCaptureCaseAndPinPage() {
  const I = this;

  I.seeCurrentUrlEquals(CaptureCaseAndPinPage.path);
  I.see(content.en.title);
}

function fillInReferenceNumberAndPinCode(referenceNumber, pinCode) {
  const I = this;

  I.fillField('referenceNumber', referenceNumber || caseConfigHelper.getTestCaseId());
  I.fillField('securityAccessCode', pinCode || idamConfigHelper.getPin());
}

module.exports = { seeCaptureCaseAndPinPage, fillInReferenceNumberAndPinCode };
