Feature('Happy path');

Scenario('Proceed with divorce', I => {
  I.amOnLoadedPage('/');
  I.click('Start now');
  I.seeIdamLoginPage();
  I.login();
  I.seeRespondPage();
  I.click('Continue');
  I.seeReviewApplicationPage();
  I.acknowledgeApplication();
  I.click('Continue');
  I.seeChooseAResponsePage();
  I.chooseToProceedWithDivorce();
  I.click('Continue');
  I.amOnLoadedPage('/end');
});
