const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

Feature('Progress bar page - CoRespondent');

Scenario('Should display content for co-respondent - Not defending response', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespNotDefending();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeCrProgressBarPage();
  I.seeContentForNotDefending();
}).retry(2);

Scenario('Should display content for co-respondent - Defending awaiting answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDefendingWaitingAnswer();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeCrProgressBarPage();
  I.seeContentForDefendingAwaitingAnswer();
}).retry(2);

Scenario('Should display content for co-respondent - Defending submitted answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDefendingSubmittedAnswer();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeCrProgressBarPage();
  I.seeContentForNotDefendingSubmittedAnswer();
}).retry(2);

Scenario('Should display content for co-respondent - Too late to Respond', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespTooLateToRespond();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeCrProgressBarPage();
  I.seeContentForTooLateToRespond();
}).retry(2);