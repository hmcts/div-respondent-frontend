const CaptureCaseAndPinPage = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const content = require('steps/capture-case-and-pin/CaptureCaseAndPin.content');

function seeCaptureCaseAndPinPage() {
  const I = this;

  I.seeCurrentUrlEquals(CaptureCaseAndPinPage.path);
  I.see(content.en.title);
}

function fillInReferenceNumberAndPinCode(referenceNumber, pinCode) {
  const I = this;

  I.fillField('referenceNumber', referenceNumber);
  I.fillField('securityAccessCode', pinCode);
}

module.exports = { seeCaptureCaseAndPinPage, fillInReferenceNumberAndPinCode };
