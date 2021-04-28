const content = require('common/content');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');

Feature('Respondent Solicitor');

Scenario('If I nominate a solicitor I submit their details and do not respond', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  if (parseBool(config.features.respSolicitorDetails)) {
    I.seeSolicitorRepPage();
    I.selectYesHaveSolicitor();
    I.click(content.en.continue);
    I.seeSolicitorDetailsPage();
    I.fillInSolicitorForm();
    I.click(content.en.continue);

    I.seeSolicitorAddressPage();
    I.fillPostcodeSolicitorAddressForm();
    I.click(content.en.continue);

    I.seeConfirmSolicitorAddress();
    I.confirmSolicitorAddress();
    I.click(content.en.continue);

    I.seeCheckYourAnswersPage();
    I.confirmInformationIsTrue();
    I.submitApplication();

    I.seeDonePage();
    I.see('LV17D80999');
  }
})
  .tag('@mock');
