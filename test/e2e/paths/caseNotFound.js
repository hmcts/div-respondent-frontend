const content = require('common/content');

Feature('No case linked to IDAM user');

Scenario('Should see capture case and pin page if user has no linked case', I => {
  I.amOnPage('/');
  I.seeExamplePage('/');
  I.click('Start now');
  I.seeIdamLoginPage();
  I.loginAsANonLinkedUser();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode('1234567890123456', '1234');
  I.click(content.en.continue);
  I.seeRespondPage();
}).retry(2);
