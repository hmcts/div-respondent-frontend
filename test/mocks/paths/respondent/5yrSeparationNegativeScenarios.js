const content = require('common/content');

Feature('5 year Separation journey - Negative Scenarios');

Scenario('Do not show financial situation for 5 year separation and defend', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs5yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeLanguagePreferencePage();
  I.chooseBilingualApplication();
  I.click(content.en.continue);

  I.seeChooseAResponsePage();
  I.chooseToDefendAgainstDivorce();
  I.click(content.en.continue);

  I.seeConfirmDefencePage();
  I.clickToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);

  I.seeDefendFinancialHardShipPage();
  I.clickNoToHardShipQuestion();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
})
  .tag('@mock');
