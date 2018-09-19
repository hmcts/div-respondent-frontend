const content = require('common/content');

Feature('Happy path');

Scenario('Proceed with divorce', I => {
  I.amOnLoadedPage('/');
  I.see('Start now');
  I.navByClick('a.button.button-start');
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
  I.amOnLoadedPage('/end');
}).retry(2);
