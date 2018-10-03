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
  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
  I.seeLegalProceedingPage();
  I.chooseNoLegalProceedings();
  I.click(content.en.continue);
  I.seeAgreeToPayCostsPage();
  I.chooseAgreeToPay();
  I.click(content.en.continue);
  I.seeContactDetailsPage();
  I.consentToSendingNotifications();
  I.click(content.en.continue);
  I.seeCheckYourAnswersPage();
  I.submitApplication();
  I.amOnLoadedPage('/end');
}).retry(2);
