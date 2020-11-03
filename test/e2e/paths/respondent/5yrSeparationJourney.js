const content = require('common/content');
const config = require('config');
const fivePlusYearsDivorceSession = require('test/resources/5PlusYears-divorce-session');

Feature('5 year Separation journey');

Scenario('@Pipeline Consent to divorce based on 5 year separation', async I => {
  await I.createAUser();
  I.createAosCaseForUser(fivePlusYearsDivorceSession);
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

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
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

Scenario('Do not show financial situation for 5 year separation and defend', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs5yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeLanguagePreferencePage();
  I.chooseBilingualApplication();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToDefendAgainstDivorce();
  I.click(content.en.continue);

  I.seeConfirmDefencePage();
  I.clickToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);

  I.seeDefendFinancialHardShipPage();
  I.clickNoToHardShipQuestion();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);
