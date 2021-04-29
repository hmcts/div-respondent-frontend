const content = require('common/content');
const basicDivorceSession = require('test/resources/basic-divorce-session');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');
const contentJurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.content');

const languages = ['en', 'cy'];

Feature('Unreasonable Behaviour Journey');

const runTests = (language = 'en') => {
  const numberOfTimesRetried = 10;
  const waitInterval = 5;

  Scenario(`Behaviour Journey, Proceed divorce with linked user - ${language} @cross-browser-test`, async I => {
    await I.retry(numberOfTimesRetried).createAUser();
    I.retry(numberOfTimesRetried).createAosCaseForUser(basicDivorceSession);
    await I.amOnLoadedPage('/', language);

    await I.retry(numberOfTimesRetried).createAUser();
    I.login(language);
    I.seeCaptureCaseAndPinPage(language);
    I.fillInReferenceNumberAndPinCode();
    I.navByClick(content[language].continue);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(waitInterval);
    }
    I.seeRespondPage(language);
    I.navByClick(content[language].continue);

    I.seeReviewApplicationPage(language);
    I.wait(waitInterval);
    I.acknowledgeApplication(language);
    I.navByClick(content[language].continue);

    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(waitInterval);
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
    I.scrollPageToBottom();
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
    I.wait(waitInterval);
    I.chooseAgreeToPay(language);
    I.navByClick(content[language].continue);

    I.seeContactDetailsPage(language);
    I.consentToSendingNotifications(language);
    I.navByClick(content[language].continue);

    if (config.features.respondentEquality === 'true') {
      I.seeEqualityPage(language);
      I.completePCQs(language);
    }

    I.wait(waitInterval);

    I.seeCheckYourAnswersPage(language);
    I.confirmInformationIsTrue(language);
    I.submitApplication(language);

    I.seeDonePage(language);
    I.see('LV18D81234');
  })
    .tag('@functional')
    .retry(numberOfTimesRetried);
};

languages
  .forEach(language => {
    runTests(language);
  });
