const content = require('common/content');

Feature('Co-respondent Adultery journey');

Scenario('Proceed to adultery admission screen and admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsCorespondent();

  I.seeCrRespondPage();
  I.click(content.en.continue);

  I.seeCrReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeCrAdmitAdulteryPage();
  I.clickCrToAdmitAdultery();
  I.click(content.en.continue);

  I.seeCrChooseAResponsePage();
  I.chooseCrToProceedWithDivorce();
  I.click(content.en.continue);

  I.seeCrAgreeToPayCostsPage();
  I.chooseCrAgreeToPay();
  I.click(content.en.continue);

  I.seeCrCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();
}).retry(2);

Scenario('Proceed to adultery admission screen and do not admit adultery', I => {
  I.amOnPage('/');

  I.seeIdamLoginPage();
  I.loginAsCorespondent();

  I.seeCrRespondPage();
  I.click(content.en.continue);

  I.seeCrReviewApplicationPage();
  I.acknowledgeApplication();
  I.click(content.en.continue);

  I.seeCrAdmitAdulteryPage();
  I.clickCrToNotAdmitAdultery();
  I.click(content.en.continue);

  I.seeCrChooseAResponsePage();
  I.chooseCrToDefendAgainstDivorce();
  I.click(content.en.continue);

  I.seeCrConfirmDefencePage();
  I.clickCrToConfirmDefenceAgainstDivorce();
  I.click(content.en.continue);

  I.seeCrCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();
}).retry(2);
