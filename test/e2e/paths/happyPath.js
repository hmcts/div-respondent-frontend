const content = require('common/content');

Feature('Happy path');

Scenario('@Integration First time new user', I => {
  I.amOnPage('/');
  I.seeExamplePage('/');
  I.click('Start now');
  I.seeIdamLoginPage();
  I.loginAsANewUser();
  I.seeCaptureCaseAndPinPage();
}).retry(2);

Scenario('Proceed with divorce with linked user', I => {
  I.amOnPage('/');
  I.seeExamplePage('/');
  I.click('Start now');
  I.seeIdamLoginPage();
  I.loginAsALinkedUser();
  I.seeRespondPage();
  I.click(content.en.continue);
  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);
  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click(content.en.continue);
  I.seeLegalProceedingPage();
  I.chooseNoLegalProceedings();
  I.click(content.en.continue);
  I.seeCheckYourAnswersPage();
  I.submitApplication();
  I.amOnLoadedPage('/end');
}).retry(2);
