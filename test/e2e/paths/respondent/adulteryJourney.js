const content = require('common/content');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

Feature('Adultery journey');

Scenario('Proceed to adultery admission screen and admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsAdulteryCase();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeAdmitAdulteryPage();
  I.clickToAdmitAdultery();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click(content.en.continue);
}).retry(2);

Scenario('Proceed to adultery admission screen and do not admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsAdulteryCase();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeAdmitAdulteryPage();
  I.clickToNotAdmitAdultery();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click(content.en.continue);
}).retry(2);
