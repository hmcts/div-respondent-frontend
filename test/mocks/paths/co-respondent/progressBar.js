Feature('Progress bar page - CoRespondent');

Scenario('Should display content for co-respondent - Not defending response', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespNotDefending();
  I.seeCrProgressBarPage();
  I.seeContentForNotDefending();
  I.seePetitionToDownload();
  I.seeCoRespAnswersToDownload();
})
  .tag('@mock');

Scenario('Should display content for co-respondent - Defending awaiting answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDefendingWaitingAnswer();
  I.seeCrProgressBarPage();
  I.seeContentForDefendingAwaitingAnswer();
  I.seePetitionToDownload();
})
  .tag('@mock');

Scenario('Should display content for co-respondent - Defending submitted answer', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDefendingSubmittedAnswer();
  I.seeCrProgressBarPage();
  I.seeContentForNotDefendingSubmittedAnswer();
  I.seePetitionToDownload();
  I.seeCoRespAnswersToDownload();
})
  .tag('@mock');

Scenario('Should display content for co-respondent - Too late to Respond', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespTooLateToRespond();
  I.seeCrProgressBarPage();
  I.seeContentForTooLateToRespond();
  I.seePetitionToDownload();
})
  .tag('@mock');

Scenario('Should display content for co-respondent - awaiting pronouncement and hearing date in the future', I => { // eslint-disable-line max-len
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespAwaitingPronouncementHearingDataFuture();
  I.seeCrProgressBarPage();
  I.seeCoRespAwaitingPronouncementHearingDataFuture();
})
  .tag('@mock');

Scenario('Should display content for co-respondent - DNPronounced with costs orde', I => { // eslint-disable-line max-len
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDNPronouncedAndCostsOrder();
  I.seeCrProgressBarPage();
  I.seeCoRespDNPronouncedAndCosts();
  I.seeCoRespCostsOrderToDownload();
})
  .tag('@mock');

Scenario('Should display content for co-respondent - DNPronounced without costs order', I => { // eslint-disable-line max-len
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAsCoRespDNPronouncedWithoutCostsOrder();
  I.seeCrProgressBarPage();
  I.seeCoRespDNPronouncedWithoutCosts();
})
  .tag('@mock');
