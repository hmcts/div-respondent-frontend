const content = require('common/content');

Feature('@Integration Happy path');

Scenario('Proceed with divorce', I => {
  I.amOnPage('/');
  I.seeExamplePage('/');
  I.click('Start now');
  I.seeIdamLoginPage();
  I.login();
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
