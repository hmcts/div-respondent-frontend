const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

Feature('Progress bar page - AoS complete status');

Scenario('Should display content for respondent that has not submitted AoS in time', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedNoAos();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeProgressBarPage();
  I.seeContentForAosNotCompleted();
}).retry(2);

Scenario('Should display content for respondent that has submitted AoS and is not defending', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedNotDefending();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeProgressBarPage();
  I.seeContentForAosCompleteNotDefending();
}).retry(2);

Scenario('Should display content for respondent that has defended, awaiting answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedAwaitingAnswer();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeProgressBarPage();
  I.seeContentForAosCompleteAwaitingAnswer();
}).retry(2);

Scenario('Should display content for respondent that has defended, and has answered', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedDefending();

  if (parseBool(config.features.showSystemMessage)) {
    I.seeSystemMessage();
  }
  I.seeProgressBarPage();
  I.seeContentForAosCompleteDefending();
}).retry(2);
