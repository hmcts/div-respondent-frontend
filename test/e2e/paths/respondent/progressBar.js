Feature('Progress bar page - AoS complete status');

Scenario('Should display content for respondent that has not submitted AoS in time', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedNoAos();
  I.seeProgressBarPage();
  I.seeContentForAosNotCompleted();
  I.seePetitionToDownload();
  I.seeCoRespondentAnswersToDownload();
}).retry(2);

Scenario('Should display content for respondent that has submitted AoS and is not defending', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedNotDefending();
  I.seeProgressBarPage();
  I.seeContentForAosCompleteNotDefending();
  I.seePetitionToDownload();
  I.seeRespondentAnswersToDownload();
  I.seeCoRespondentAnswersToDownload();
}).retry(2);

Scenario('Should display content for respondent that has defended, awaiting answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedAwaitingAnswer();
  I.seeProgressBarPage();
  I.seeContentForAosCompleteAwaitingAnswer();
  I.seePetitionToDownload();
  I.seeRespondentAnswersToDownload();
  I.seeCoRespondentAnswersToDownload();
}).retry(2);

Scenario('Should display content for respondent that has defended, and has answered', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCaseProgressedDefending();
  I.seeProgressBarPage();
  I.seeContentForAosCompleteDefending();
  I.seePetitionToDownload();
  I.seeRespondentAnswersToDownload();
  I.seeCoRespondentAnswersToDownload();
}).retry(2);
