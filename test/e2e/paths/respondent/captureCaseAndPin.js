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
}).retry(2);

Scenario('Can link case using case ID/PIN code if ID has extra nonnumerical characters', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsANonLinkedUser();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('AAA1234123412341234AAAA', '12345678');
  I.click(commonContent.en.continue);
  I.seeRespondPage();
}).retry(2);

Scenario('Should see an error page if PIN code is invalid', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsInvalidPinUser();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('9234567891234567', '12345678');
  I.click(commonContent.en.continue);
  I.seeCaptureCaseAndPinPage();
  I.see(content.en.referenceNumberOrPinDoNotMatch);
}).retry(2);

Scenario('Should see a generic error page if link case fails', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsNonLinkedUserAndServerError();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('9234567891234567', '12345678');
  I.click(commonContent.en.continue);
  I.seeCaptureCaseAndPinPage();
  I.see(content.en.errorLinkingCase);
}).retry(2);
