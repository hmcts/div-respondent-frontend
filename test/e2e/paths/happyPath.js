const content = require('common/content');
const basicDivorceSession = require('test/resources/basic-divorce-session');

Feature('Happy path');

Scenario('First time new user', async I => {
  await I.createAUser();
  I.createAosCaseForUser(basicDivorceSession);
  I.amOnLoadedPage('/');
  I.seeExamplePage();
  I.navByClick('Start now');
  I.seeIdamLoginPage();
  await I.createAUser();
  I.login();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode();
  I.navByClick(content.en.continue);
  I.seeRespondPage();
}).retry(2);

Scenario('@Pipeline Proceed with divorce with linked user', async I => {
  await I.createAUser();
  I.createAosCaseForUser(basicDivorceSession);
  I.amOnLoadedPage('/');
  I.seeExamplePage();
  I.navByClick('Start now');
  I.seeIdamLoginPage();
  await I.createAUser();
  I.login();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode();
  I.navByClick(content.en.continue);
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
}).retry(0);


Scenario('Disagree with divorce', I => { // eslint-disable-line
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.loginAsALinkedUser();

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
});

Scenario('Disagree with divorce but change response', I => { // eslint-disable-line
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.loginAsALinkedUser();

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
});
