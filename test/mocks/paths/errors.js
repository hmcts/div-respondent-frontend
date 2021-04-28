Feature('Server error - see correct message');

Scenario('Should display error content given a 500 error', I => {
  I.amOnPage('/');
  I.seeIdamLoginPage();
  I.loginAndThrowError();
  I.seeServerErrorContent();
})
  .tag('@mocks');

Scenario('Should display error content given a 404 error', I => {
  I.amOnPage('/non-existent-page');
  I.seeNotFoundErrorContent();
})
  .tag('@mocks');
