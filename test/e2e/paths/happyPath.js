const content = require('common/content');

Feature('Happy path');

Scenario('Proceed with divorce', I => {
  I.amOnPage('/entry');
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

Scenario('Disagree with divorce', I => {
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.login();
  I.seeRespondPage();
  I.click(content.en.continue);
  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);
  I.seeChooseAResponsePage();
  I.chooseToDefendAgainstDivorce();
  I.click(content.en.continue);
  I.seeConfirmDefencePage();
  I.clickToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);
  I.amOnLoadedPage('/end');
}).retry(2);

Scenario('Disagree with divorce but change response', I => {
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.login();
  I.seeRespondPage();
  I.click(content.en.continue);
  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);
  I.seeChooseAResponsePage();
  I.chooseToDefendAgainstDivorce();
  I.click(content.en.continue);
  I.seeConfirmDefencePage();
  I.clickToChangeResponse();
  I.click(content.en.continue);
  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click(content.en.continue);
  I.amOnLoadedPage('/end');
}).retry(2);
