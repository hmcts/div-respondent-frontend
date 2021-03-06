const commonContent = require('common/content');
const content = require('steps/capture-case-and-pin/CaptureCaseAndPin.content');

Feature('CaptureCaseAndPin step');

Scenario('Can link case using case ID/PIN code', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsANonLinkedUser();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('9234567891234567', '12345678');
  I.click(commonContent.en.continue);
  I.seeRespondPage();
})
  .tag('@mock');

Scenario('Can link case using case ID/PIN code when IssuedToBailiff', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsANonLinkedUserAndIssuedToBailiff();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('9234567891234567', '12345678');
  I.click(commonContent.en.continue);
  I.see(content.en.title);
})
  .tag('@mock');

Scenario('Can link case using case ID/PIN code if ID has extra nonnumerical characters', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsANonLinkedUser();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('AAA1234123412341234AAAA', '12345678');
  I.click(commonContent.en.continue);
  I.seeRespondPage();
})
  .tag('@mock');

Scenario('Should see an error page if PIN code is invalid', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsInvalidPinUser();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('9234567891234567', '12345678');
  I.click(commonContent.en.continue);
  I.seeCaptureCaseAndPinPage();
  I.see(content.en.referenceNumberOrPinDoNotMatch);
})
  .tag('@mock');

Scenario('Should see a generic error page if link case fails', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsNonLinkedUserAndServerError();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('9234567891234567', '12345678');
  I.click(commonContent.en.continue);
  I.seeCaptureCaseAndPinPage();
  I.see(content.en.errorLinkingCase);
})
  .tag('@mock');
