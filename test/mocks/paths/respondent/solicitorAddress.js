Feature('Solicitor Address');

const SolicitorAddress = require('steps/respondent/solicitor-address/SolicitorAddress.step');
const content = require('common/content');
const CheckYourAnswersPage = require('steps/respondent/check-your-answers/CheckYourAnswers.step');

Scenario('Fill address using postcode', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();

  I.amOnPage(SolicitorAddress.path);
  I.seeSolicitorAddressPage();

  I.fillPostcodeSolicitorAddressForm();
  I.click(content.en.continue);

  I.seeConfirmSolicitorAddress();
  I.confirmSolicitorAddress();
  I.click(content.en.continue);

  I.seeCurrentUrlEquals(CheckYourAnswersPage.path);
})
  .tag('@mock');

Scenario('Fill address using manual address', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();

  I.amOnPage(SolicitorAddress.path);
  I.fillManuallSolicitorAddressForm();
  I.click(content.en.continue);

  I.seeConfirmSolicitorAddress();
  I.confirmSolicitorAddress();
  I.click(content.en.continue);

  I.seeCurrentUrlEquals(CheckYourAnswersPage.path);
})
  .tag('@mock');
