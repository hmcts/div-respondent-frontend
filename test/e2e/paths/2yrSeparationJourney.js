const content = require('common/content');

Feature('Two year separation journey');

Scenario('Consent to divorce based on 2 year separation', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToConsentToDivorce();
  I.click(content.en.continue);

  I.seeFinancialSituationPage();
  I.clickToConsiderFinancialSituation();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);

Scenario('Do not consent to 2 year separation and will defend against divorce', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToDefendDivorce();
  I.click(content.en.continue);

  I.seeConfirmDefencePage();
  I.clickToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);

Scenario('Do not consent to 2 year separation but will not defend against divorce, do not consider finance', I => { // eslint-disable-line
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToNotDefendDivorce();
  I.click(content.en.continue);

  I.seeNoConsentAreYouSurePage();
  I.clickToConfirmNoConsent();
  I.click(content.en.continue);

  I.seeFinancialSituationPage();
  I.clickToNotConsiderFinancialSituation();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);

Scenario('Initially defend then change response for 2yr separation, no consent', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAs2yrSeparationCase();

  I.seeRespondPage();
  I.click(content.en.continue);

  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToDefendDivorce();
  I.click(content.en.continue);

  I.seeConfirmDefencePage();
  I.clickToChangeResponse();
  I.click(content.en.continue);

  I.seeConsentDecreePage();
  I.clickToNotConsentDivorce();
  I.clickToNotDefendDivorce();
  I.click(content.en.continue);

  I.seeNoConsentAreYouSurePage();
  I.clickToConfirmNoConsent();
  I.click(content.en.continue);

  I.seeFinancialSituationPage();
  I.clickToNotConsiderFinancialSituation();
  I.click(content.en.continue);

  I.seeJurisdictionPage();
  I.chooseAgreeToJurisdiction();
  I.click(content.en.continue);
}).retry(2);
