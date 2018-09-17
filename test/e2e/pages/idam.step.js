const IdamLoginPage = require('mocks/steps/idamLogin/IdamLogin.step');
const commonContent = require('common/content');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const config = require('config');
// const idamConfigHelper = require('test/e2e/helpers/idamConfigHelper.js');

function seeIdamLoginPage() {
  const I = this;
  I.see(content.en.title);
}

function login() {
  const I = this;

  if (config.features.idam) {
    I.seeInCurrentUrl('/login?');
    I.fillField('username', 'vivdivred@mailinator.com');
    I.fillField('password', 'Password21');
    I.navByClick('Sign in');
    I.wait(2);
  } else {
    I.seeCurrentUrlEquals(IdamLoginPage.path);
    I.click(content.en.fields.success.yes);
    I.click(commonContent.en.continue);
  }
}

module.exports = {
  seeIdamLoginPage,
  login
};
