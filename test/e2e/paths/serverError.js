Feature('Server error - see correct message');

Scenario('Should display error content given a 500 error', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAndThrowError();
  I.seeErrorContent();
}).retry(2);
