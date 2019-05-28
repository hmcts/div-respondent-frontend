Feature('Progress bar page - CoRespondent');

Scenario('Should display content for co-respondent - Not defending response', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespNotDefending();
  I.seeCrProgressBarPage();
  I.seeContentForNotDefending();
  I.seePetitionToDownload();
  I.seeCoRespAnswersToDownload();
}).retry(2);

Scenario('Should display content for co-respondent - Defending awaiting answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDefendingWaitingAnswer();
  I.seeCrProgressBarPage();
  I.seeContentForDefendingAwaitingAnswer();
  I.seePetitionToDownload();
  I.seeRespAnswersToDownload();
}).retry(2);

Scenario('Should display content for co-respondent - Defending submitted answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDefendingSubmittedAnswer();
  I.seeCrProgressBarPage();
  I.seeContentForNotDefendingSubmittedAnswer();
  I.seePetitionToDownload();
  I.seeCoRespAnswersToDownload();
}).retry(2);

Scenario('Should display content for co-respondent - Too late to Respond', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespTooLateToRespond();
  I.seeCrProgressBarPage();
  I.seeContentForTooLateToRespond();
  I.seePetitionToDownload();
}).retry(2);