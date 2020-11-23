const content = require('common/content');
const basicDivorceSession = require('test/resources/basic-divorce-session');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');
const contentJurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.content');

Feature('Unreasonable Behaviour Journey');
const languages = ['en', 'cy'];

const runTests = (language = 'en') => {
  Scenario(`@Pipeline Behaviour Journey, Proceed divorce with linked user - ${language}`, async I => {
    await I.retry(2).createAUser();
    I.retry(2).createAosCaseForUser(basicDivorceSession);
    await I.amOnLoadedPage('/', language);

    await I.retry(2).createAUser();
    I.login(language);
    I.seeCaptureCaseAndPinPage(language);
    I.fillInReferenceNumberAndPinCode();
    I.navByClick(content[language].continue);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(30);
    }
    I.seeRespondPage(language);
    I.navByClick(content[language].continue);

    I.seeReviewApplicationPage(language);
    I.wait(5);
    I.acknowledgeApplication(language);
    I.navByClick(content[language].continue);

    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(30);
      if (parseBool(config.features.respSolicitorDetails)) {
        I.seeSolicitorRepPage(language);
        I.selectNoSolicitor(language);
        I.click(content[language].continue);
      }
    }

    I.seeLanguagePreferencePage(language);
    I.chooseBilingualApplication(language);
    I.click(content[language].continue);

    I.seeChooseAResponsePage(language);
    I.chooseToProceedWithDivorce(language);
    I.navByClick(content[language].continue);

    I.seeJurisdictionPage(language);
    I.chooseAgreeToJurisdiction(language);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.click(contentJurisdiction[language].fields.disagree.heading);
      I.fillField('jurisdiction.reason', 'what to try something diff for crossbrowser');
      I.fillField('jurisdiction.country', 'USA');
    }
    I.navByClick(content[language].continue);

    I.seeLegalProceedingPage(language);
    I.chooseNoLegalProceedings(language);
    I.navByClick(content[language].continue);

    I.seeAgreeToPayCostsPage(language);
    I.wait(5);
    I.chooseAgreeToPay(language);
    I.navByClick(content[language].continue);

    I.seeContactDetailsPage(language);
    I.consentToSendingNotifications(language);
    I.navByClick(content[language].continue);

    if (config.features.respondentEquality === 'true') {
      I.seeEqualityPage(language);
      I.completePCQs(language);
    }

    I.wait(5);

    I.seeCheckYourAnswersPage(language);
    I.confirmInformationIsTrue(language);
    I.submitApplication(language);

    I.seeDonePage(language);
    I.see('LV18D81234');
  }).retry(2);
};

languages
  .forEach(language => {
    runTests(language);
  });
