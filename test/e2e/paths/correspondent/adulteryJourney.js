const content = require('common/content');

Feature('Correspondent Adultery journey');

Scenario('Proceed to adultery admission screen and admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsCorrespondent();

  I.seeCrRespondPage();
  I.click(content.en.continue);

  I.seeCrReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeAdmitAdulteryPage();
  I.clickToAdmitAdultery();
  I.click(content.en.continue);
}).retry(2);

Scenario('Proceed to adultery admission screen and do not admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsCorrespondent();

  I.seeCrRespondPage();
  I.click(content.en.continue);

  I.seeCrReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeAdmitAdulteryPage();
  I.clickToNotAdmitAdultery();
  I.click(content.en.continue);
}).retry(2);
