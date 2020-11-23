Feature('Sign out');

Scenario('@Pipeline Should display End Page when signed out', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAs5yrSeparationCase();
  I.click('Sign out');
  I.seeEndPage();
}).retry(2);
