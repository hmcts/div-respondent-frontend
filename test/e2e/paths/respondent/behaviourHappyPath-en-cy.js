const content = require('common/content');
const basicDivorceSession = require('test/resources/basic-divorce-session');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');
const contentJurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.content');

const language = ['en', 'cy'];

Feature('Happy path');

for (const i of language) {
  // eslint-disable-next-line no-undef
  Data(language).Scenario('@Pipeline Behaviour Journey, Proceed divorce with linked user', async I => {
    await I.createAUser();
    I.createAosCaseForUser(basicDivorceSession);
    await I.amOnLoadedPage('/', [i]);

    await I.createAUser();
    I.login([i]);
    I.seeCaptureCaseAndPinPage([i]);
    I.fillInReferenceNumberAndPinCode();
    I.navByClick(content[i].continue);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(30);
    }
    I.seeRespondPage([i]);
    I.navByClick(content[i].continue);
    I.seeReviewApplicationPage([i]);
    I.wait(5);
    I.acknowledgeApplication([i]);
    I.navByClick(content[i].continue);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(30);

      if (parseBool(config.features.respSolicitorDetails)) {
        I.seeSolicitorRepPage([i]);
        I.selectNoSolicitor([i]);
        I.click(content[i].continue);
      }
    }

    I.seeLanguagePreferencePage([i]);
    I.chooseBilingualApplication([i]);
    I.click(content[i].continue);

    I.seeChooseAResponsePage([i]);
    I.chooseToProceedWithDivorce([i]);
    I.navByClick(content[i].continue);

    I.seeJurisdictionPage([i]);
    I.chooseAgreeToJurisdiction([i]);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.click(contentJurisdiction[i].fields.disagree.heading);
      I.fillField('jurisdiction.reason', 'what to try something diff for crossbrowser');
      I.fillField('jurisdiction.country', 'USA');
    }

    I.navByClick(content[i].continue);

    I.seeLegalProceedingPage([i]);
    I.chooseNoLegalProceedings([i]);

    I.navByClick(content[i].continue);

    I.seeAgreeToPayCostsPage([i]);
    I.wait(5);
    I.chooseAgreeToPay([i]);
    I.navByClick(content[i].continue);

    I.seeContactDetailsPage([i]);
    I.consentToSendingNotifications([i]);
    I.navByClick(content[i].continue);

    if (config.features.respondentEquality === 'true') {
      I.seeEqualityPage([i]);
      I.completePCQs([i]);
    }

    I.wait(5);

    I.seeCheckYourAnswersPage([i]);
    I.confirmInformationIsTrue([i]);
    I.submitApplication([i]);

    I.seeDonePage([i]);
    I.see('LV18D81234');
  }).retry(2).tag('e2e');
}
