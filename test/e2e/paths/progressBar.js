Feature('Progress bar page - AoS complete status');

Scenario('Should display content for respondent that has not submitted AoS in time', I => {
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedNoAos();
  I.seeProgressBarPage();
  I.seeContentForAosNotCompleted();
}).retry(2);

Scenario('Should display content for respondent that has submitted AoS and is not defending', I => {
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedNotDefending();
  I.seeProgressBarPage();
  I.seeContentForAosCompleteNotDefending();
}).retry(2);

Scenario('Should display content for respondent that has defended, awaiting answer', I => {
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedAwaitingAnswer();
  I.seeProgressBarPage();
  I.seeContentForAosCompleteAwaitingAnswer();
}).retry(2);

Scenario('Should display content for respondent that has defended, ans has answered', I => {
  I.amOnPage('/entry');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedDefending();
  I.seeProgressBarPage();
  I.seeContentForAosCompleteDefending();
}).retry(2);
