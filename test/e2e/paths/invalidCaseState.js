Feature('Invalid case state');

Scenario('Should see error page if case is not AOS started', I => {
  I.amOnPage('/');
  I.seeExamplePage('/');
  I.click('Start now');
  I.seeIdamLoginPage();
  I.loginAsCaseCompletedUser();
  I.seeInvalidStatePage();
}).retry(2);
