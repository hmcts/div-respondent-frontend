const IdamLoginPage = require('mocks/steps/idamLogin/IdamLogin.step');
const commonContent = require('common/content');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const config = require('config');

function seeIdamLoginPage() {
  const I = this;
  I.waitForText(content.en.title, 3);
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
    I.click(content.en.fields.success.yesCaseAwaitingResponse);
    I.click(commonContent.en.continue);
  }
}

function loginAsANonLinkedUser() {
  const I = this;

  I.click(content.en.fields.success.yesCaseNotLinked);
  I.click(commonContent.en.continue);
}

module.exports = {
  seeIdamLoginPage,
  login,
  loginAsANonLinkedUser
};
