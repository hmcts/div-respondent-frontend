const content = require('common/content');
const config = require('config');
const adulteryDivorceSession = require('test/resources/corespondent-divorce-session');

Feature('Co-respondent Adultery journey');

Scenario('@Pipeline Proceed to adultery admission screen and admit adultery', async I => {
  await I.createAUser();
  I.createAosCaseForUser(adulteryDivorceSession, true);
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
  I.seeCrRespondPage();
  I.click(content.en.continue);

  I.seeCrReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeCrAdmitAdulteryPage();
  I.clickCrToAdmitAdultery();
  I.click(content.en.continue);

  I.seeCrChooseAResponsePage();
  I.chooseCrToProceedWithDivorce();
  I.click(content.en.continue);

  I.seeCrAgreeToPayCostsPage();
  I.chooseCrAgreeToPay();
  I.click(content.en.continue);

  I.seeCrContactDetailsPage();
  I.consentToSendingCrNotifications();
  I.navByClick(content.en.continue);

  if (config.features.respondentEquality === 'true') {
    I.seeEqualityPage();
    I.completePCQs();
  }

  I.wait(5);

  I.seeCrCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();

  I.seeDonePage();
  I.see('LV17D80100');
}).retry(2);

Scenario('Proceed to adultery admission screen and do not admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsCorespondent();

  I.seeCrRespondPage();
  I.click(content.en.continue);

  I.seeCrReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeCrAdmitAdulteryPage();
  I.clickCrToNotAdmitAdultery();
  I.click(content.en.continue);

  I.seeCrChooseAResponsePage();
  I.chooseCrToDefendAgainstDivorce();
  I.click(content.en.continue);

  I.seeCrConfirmDefencePage();
  I.clickCrToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);

  I.seeCrAgreeToPayCostsPage();
  I.chooseCrAgreeToPay();
  I.click(content.en.continue);

  I.seeCrContactDetailsPage();
  I.consentToSendingCrNotifications();
  I.navByClick(content.en.continue);

  I.seeCrCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();
}).retry(2);
