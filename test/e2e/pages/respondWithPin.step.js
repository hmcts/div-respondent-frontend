const RespondWithPinPage = require('steps/respond-with-pin/RespondWithPin.step');
const content = require('steps/respond-with-pin/RespondWithPin.content');

function seeRespondWithPinPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondWithPinPage.path);
  I.see(content.en.title);
}

function fillInReferenceNumberAndPinCode(referenceNumber, pinCode) {
  const I = this;

  I.fillField('referenceNumber', referenceNumber);
  I.fillField('securityAccessCode', pinCode);
}

module.exports = { seeRespondWithPinPage, fillInReferenceNumberAndPinCode };
