const IdamLoginPage = require('mocks/steps/idamLogin/IdamLogin.step');
const commonContent = require('common/content');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const config = require('config');
const idamConfigHelper = require('test/e2e/helpers/idamConfigHelper.js');

function seeIdamLoginPage() {
  const I = this;
  I.waitForText(content.en.title, 3);
}

function loginAsANewUser() {
  const I = this;

  if (config.features.idam) {
    I.seeInCurrentUrl('/login?');
    I.fillField('username', idamConfigHelper.getTestEmail());
    I.fillField('password', idamConfigHelper.getTestPassword());
    I.navByClick('Sign in');
    I.wait(2);
  } else {
    I.seeCurrentUrlEquals(IdamLoginPage.path);
    I.click(content.en.fields.success.yesCaseNotLinked);
    I.click(commonContent.en.continue);
  }
}

function loginAsALinkedUser() {
  const I = this;

  I.click(content.en.fields.success.yesCaseStarted);
  I.click(commonContent.en.continue);
}

function loginAsANonLinkedUser() {
  const I = this;

  I.click(content.en.fields.success.yesCaseNotLinked);
  I.click(commonContent.en.continue);
}

function loginAsCaseCompletedUser() {
  const I = this;

  I.click(content.en.fields.success.yesCaseCompleted);
  I.click(commonContent.en.continue);
}

function loginAsInvalidPinUser() {
  const I = this;

  I.click(content.en.fields.success.yesCaseNotLinkedAndInvalidPin);
  I.click(commonContent.en.continue);
}

function loginAsNonLinkedUserAndServerError() {
  const I = this;

  I.click(content.en.fields.success.yesCaseNotLinkedAndServerError);
  I.click(commonContent.en.continue);
}

function loginAsAdulteryCase() {
  const I = this;

  I.click(content.en.fields.success.yesAdultery);
  I.click(commonContent.en.continue);
}

function loginAs2yrSeparationCase() {
  const I = this;

  I.click(content.en.fields.success.yes2yrSeparation);
  I.click(commonContent.en.continue);
}

function loginAs5yrSeparationCase() {
  const I = this;

  I.click(content.en.fields.success.yes5yrSeparation);
  I.click(commonContent.en.continue);
}

module.exports = {
  seeIdamLoginPage,
  loginAsANewUser,
  loginAsANonLinkedUser,
  loginAsCaseCompletedUser,
  loginAsInvalidPinUser,
  loginAsALinkedUser,
  loginAsNonLinkedUserAndServerError,
  loginAsAdulteryCase,
  loginAs2yrSeparationCase,
  loginAs5yrSeparationCase
};
