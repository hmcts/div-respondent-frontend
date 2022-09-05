//  const content = require('common/content');
//  const config = require('config');
//  const adulteryDivorceSession = require('test/resources/corespondent-divorce-session');
//
//  const languages = ['en', 'cy'];
//
//  Feature('Co-respondent Adultery Journey');
//
//  const runTests = (language = 'en') => {
//    Scenario(`Proceed to adultery admission screen and admit adultery - ${language}`, async I => {
//      await I.retry(2).createAUser();
//      I.retry(2).createAosCaseForUser(adulteryDivorceSession, true);
//      await I.amOnLoadedPage('/', language);
//
//      await I.retry(2).createAUser();
//      I.login(language);
//      I.seeCaptureCaseAndPinPage(language);
//      I.fillInReferenceNumberAndPinCode();
//      I.navByClick(content[language].continue);
//      if (config.tests.e2e.addWaitForCrossBrowser) {
//        I.wait(3);
//      }
//
//      I.seeCrRespondPage(language);
//      I.click(content[language].continue);
//
//      I.seeCrReviewApplicationPage(language);
//      I.acknowledgeApplicationCr(language);
//      I.click(content[language].continue);
//
//      I.seeCrAdmitAdulteryPage(language);
//      I.clickCrToAdmitAdultery(language);
//      I.click(content[language].continue);
//
//      I.seeCrChooseAResponsePage(language);
//      I.chooseCrToProceedWithDivorce(language);
//      I.click(content[language].continue);
//
//      I.seeCrAgreeToPayCostsPage(language);
//      I.chooseCrAgreeToPay(language);
//      I.click(content[language].continue);
//
//      I.seeCrContactDetailsPage(language);
//      I.consentToSendingCrNotifications(language);
//      I.navByClick(content[language].continue);
//
//      if (config.features.respondentEquality === 'true') {
//        I.seeEqualityPage(language);
//        I.completePCQs(language);
//      }
//
//      I.wait(5);
//
//      I.seeCrCheckYourAnswersPage(language);
//      I.confirmInformationIsTrueCr(language);
//      I.submitApplicationCr(language);
//      I.seeDonePage(language);
//      I.see('EZ12D91234');
//    })
//      .tag('@functional')
//      .retry(2);
//  };
//
//  languages
//    .forEach(language => {
//      runTests(language);
//    });
