const content = require('common/content');
const desertionSession = require('test/resources/desertion-session');
const config = require('config');


Feature('Desertion journey');

Scenario('@Pipeline Proceed with divorce with desertion without agreement case', async I => {
  await I.createAUser();
  I.createAosCaseForUser(desertionSession);
  await I.amOnLoadedPage('/');

  I.seeIdamLoginPage();
  await I.createAUser();
  I.login();
  I.seeCaptureCaseAndPinPage();
  I.fillInReferenceNumberAndPinCode();
  I.navByClick(content.en.continue);
  if (config.tests.e2e.addWaitForCrossBrowser) {
    I.wait(30);
  }
  I.seeRespondPage();
  I.navByClick(content.en.continue);

  I.seeReviewApplicationPage();
  I.wait(5);
  I.acknowledgeApplication();
  I.navByClick(content.en.continue);

  I.seeLanguagePreferencePage();
  I.chooseBilingualApplication();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.navByClick(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.navByClick(content.en.continue);

  I.seeLegalProceedingPage();
  I.chooseNoLegalProceedings();
  I.navByClick(content.en.continue);

  I.seeContactDetailsPage();
  I.consentToSendingNotifications();
  I.navByClick(content.en.continue);

  if (config.features.respondentEquality === 'true') {
    I.seeEqualityPage();
    I.completePCQs();
  }

  I.wait(5);

  I.seeCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();

  I.seeDonePage();
  I.see('EZ12D81281');
}).retry(2);
