const content = require('common/content');
const basicDivorceSession = require('test/resources/basic-divorce-session');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');
const contentJurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.content');

Feature('Happy path');

Scenario('@Pipeline Proceed with divorce with linked user', async I => {
  await I.createAUser();
  I.createAosCaseForUser(basicDivorceSession);
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
  if (config.tests.e2e.addWaitForCrossBrowser) {
    I.wait(30);

    if (parseBool(config.features.respSolicitorDetails)) {
      I.seeSolicitorRepPage();
      I.selectNoSolicitor();
      I.click(content.en.continue);
    }
  }

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.navByClick(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  if (config.tests.e2e.addWaitForCrossBrowser) {
    I.click(contentJurisdiction.en.fields.disagree.heading);
    I.fillField('jurisdiction.reason', 'what to try something diff for crossbrowser');
    I.fillField('jurisdiction.country', 'USA');
  }

  I.navByClick(content.en.continue);

  I.seeLegalProceedingPage();
  I.chooseNoLegalProceedings();

  I.navByClick(content.en.continue);

  I.seeAgreeToPayCostsPage();
  I.wait(5);
  I.chooseAgreeToPay();
  I.navByClick(content.en.continue);

  I.seeContactDetailsPage();
  I.consentToSendingNotifications();
  I.navByClick(content.en.continue);

  I.seeCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();

  I.seeDonePage();
  I.see('LV18D81234');
}).retry(2);


Scenario('Disagree with divorce', I => { // eslint-disable-line
  I.amOnPage('/');
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
  I.confirmInformationIsTrue();
  I.submitApplication();

  I.seeDonePage();
});

Scenario('Disagree with divorce but change response', I => { // eslint-disable-line
  I.amOnPage('/');
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
  I.confirmInformationIsTrue();
  I.submitApplication();

  I.seeDonePage();
});
