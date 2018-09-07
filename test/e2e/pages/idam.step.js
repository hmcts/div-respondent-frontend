const IdamLoginPage = require('mocks/steps/idamLogin/IdamLogin.step');

function seeIdamLoginPage() {
  const I = this;

  I.seeCurrentUrlEquals(IdamLoginPage.path);
  I.see('Idam login');
}

function login() {
  const I = this;

  I.click('Yes');
  I.click('Continue');
}

module.exports = {
  seeIdamLoginPage,
  login
};
