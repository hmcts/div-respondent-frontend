const content = require('common/content');

Feature('Adultery journey');

Scenario('@Pipeline Proceed to adultery admission screen and admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsAdulteryCase();

  I.seeRespondPage();
  I.seeDocumentsForDownload();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeAdmitAdulteryPage();
  I.clickToAdmitAdultery();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click(content.en.continue);
}).retry(2);

Scenario('@Pipeline Proceed to adultery admission screen and do not admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsAdulteryCase();

  I.seeRespondPage();
  I.seeDocumentsForDownload();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeAdmitAdulteryPage();
  I.clickToNotAdmitAdultery();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click(content.en.continue);
}).retry(2);
