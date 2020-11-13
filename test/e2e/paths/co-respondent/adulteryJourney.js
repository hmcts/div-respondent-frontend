const content = require('common/content');
const config = require('config');
const adulteryDivorceSession = require('test/resources/corespondent-divorce-session');

Feature('Co-respondent Adultery Journey');
const languages = (config.tests.e2e.allLanguages === 'true') ? ['en', 'cy'] : ['en'];

const runTests = (language = 'en') => {
  Scenario(`@Pipeline Proceed to adultery admission screen and admit adultery - ${language}`, async I => {
    await I.createAUser();
    I.createAosCaseForUser(adulteryDivorceSession, true);
    await I.amOnLoadedPage('/', language);

    await I.createAUser();
    I.login(language);
    I.seeCaptureCaseAndPinPage(language);
    I.fillInReferenceNumberAndPinCode();
    I.navByClick(content[language].continue);
    if (config.tests.e2e.addWaitForCrossBrowser) {
      I.wait(30);
    }

    I.seeCrRespondPage(language);
    I.click(content[language].continue);

    I.seeCrReviewApplicationPage(language);
    I.acknowledgeApplicationCr(language);
    I.click(content[language].continue);

    I.seeCrAdmitAdulteryPage(language);
    I.clickCrToAdmitAdultery(language);
    I.click(content[language].continue);

    I.seeCrChooseAResponsePage(language);
    I.chooseCrToProceedWithDivorce(language);
    I.click(content[language].continue);

    I.seeCrAgreeToPayCostsPage(language);
    I.chooseCrAgreeToPay(language);
    I.click(content[language].continue);

    I.seeCrContactDetailsPage(language);
    I.consentToSendingCrNotifications(language);
    I.navByClick(content[language].continue);

    if (config.features.respondentEquality === 'true') {
      I.seeEqualityPage(language);
      I.completePCQs(language);
    }

    I.wait(5);

    I.seeCrCheckYourAnswersPage(language);
    I.confirmInformationIsTrueCr(language);
    I.submitApplicationCr(language);
    I.see('EZ12D91234');
  })
    .retry(2);
};

languages
  .forEach(language => {
    runTests(language);
  });

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

  I.seeCrAgreeToPayCostsPage();
  I.chooseCrAgreeToPay();
  I.click(content.en.continue);

  I.seeCrContactDetailsPage();
  I.consentToSendingCrNotifications();
  I.navByClick(content.en.continue);

  I.seeCrCheckYourAnswersPage();
  I.confirmInformationIsTrue();
  I.submitApplication();
})
  .retry(2);
