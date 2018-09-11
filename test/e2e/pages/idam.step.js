const commonContent = require('common/content');
const content = require('mocks/steps/idamLogin/IdamLogin.content');

function seeIdamLoginPage() {
  const I = this;

  I.see(content.en.title);
}

function login() {
  const I = this;

  I.click(content.en.fields.success.yes);
  I.click(commonContent.en.continue);
}

module.exports = {
  seeIdamLoginPage,
  login
};
