const content = require('common/content');
const config = require('config');
const twoPlusYearsDivorceSession = require('test/resources/2PlusYears-divorce-session');

Feature('Two year separation journey');

Scenario('@Pipeline Consent to divorce based on 2 year separation', async I => {
  await I.createAUser();
  I.createAosCaseForUser(twoPlusYearsDivorceSession);
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
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeLanguagePreferencePage();
  I.chooseBilingualApplication();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToConsentToDivorce();
  I.click(content.en.continue);

  I.seeFinancialSituationPage();
  I.clickToConsiderFinancialSituation();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);

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
  I.see('LV17D80999');
}).retry(2);

Scenario('Do not consent to 2 year separation and will defend against divorce', I => {
  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToDefendDivorce();
  I.click(content.en.continue);

  I.seeConfirmDefencePage();
  I.clickToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);

Scenario('Do not consent to 2 year separation but will not defend against divorce, do not consider finance', I => { // eslint-disable-line
  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToNotDefendDivorce();
  I.click(content.en.continue);

  I.seeNoConsentAreYouSurePage();
  I.clickToConfirmNoConsent();
  I.click(content.en.continue);

  I.seeFinancialSituationPage();
  I.clickToNotConsiderFinancialSituation();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);

Scenario('Initially defend then change response for 2yr separation, no consent', I => {
  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToDefendDivorce();
  I.click(content.en.continue);

  I.seeConfirmDefencePage();
  I.clickToChangeResponse();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToNotDefendDivorce();
  I.click(content.en.continue);

  I.seeNoConsentAreYouSurePage();
  I.clickToConfirmNoConsent();
  I.click(content.en.continue);

  I.seeFinancialSituationPage();
  I.clickToNotConsiderFinancialSituation();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);
