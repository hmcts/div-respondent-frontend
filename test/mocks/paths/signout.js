Feature('Sign out');

Scenario('Should display End Page when signed out', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAs5yrSeparationCase();
  I.click('Sign out');
  I.seeEndPage();
})
  .tag('@mocks');
