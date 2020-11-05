const IdamLoginPage = require('mocks/steps/idamLogin/IdamLogin.step');
const commonContent = require('common/content');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const config = require('config');
const idamConfigHelper = require('test/e2e/helpers/idamConfigHelper.js');

function seeIdamLoginPage(language = 'en') {
  const I = this;
  I.seeInCurrentUrl('login');
  I.waitForText(content[language].title);
}

function login(language = 'en') {
  const I = this;

  if (config.features.idam) {
    I.seeInCurrentUrl('/login?');
    I.fillField('username', idamConfigHelper.getTestEmail());
    I.fillField('password', idamConfigHelper.getTestPassword());
    I.navByClick('Sign in');
    I.wait(2);
  } else {
    I.seeCurrentUrlEquals(IdamLoginPage.path);
    I.click(content[language].fields.success.yesCaseNotLinked);
    I.click(commonContent[language].continue);
  }
}

function loginCy(language = 'cy') {
  const I = this;

  if (config.features.idam) {
    I.seeInCurrentUrl('/login?');
    I.fillField('username', idamConfigHelper.getTestEmail());
    I.fillField('password', idamConfigHelper.getTestPassword());
    I.navByClick('Mewngofnodi');
    I.wait(2);
  } else {
    I.seeCurrentUrlEquals(IdamLoginPage.path);
    I.click(content[language].fields.success.yesCaseNotLinked);
    I.click(commonContent[language].continue);
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
function loginAsCaseProgressedNoAos() {
  const I = this;

  I.click(content.en.fields.success.yesCaseProgressedNoAos);
  I.click(commonContent.en.continue);
}

function loginAsCaseProgressedNotDefending() {
  const I = this;

  I.click(content.en.fields.success.yesCaseProgressedUndefended);
  I.click(commonContent.en.continue);
}

function loginAsCaseProgressedAwaitingAnswer() {
  const I = this;

  I.click(content.en.fields.success.yesCaseProgressedAwaitingAnswer);
  I.click(commonContent.en.continue);
}

function loginAsCaseProgressedDefending() {
  const I = this;

  I.click(content.en.fields.success.yesCaseProgressedDefending);
  I.click(commonContent.en.continue);
}

function loginAsCaseAwaitingDecreeAbsolute() {
  const I = this;

  I.click(content.en.fields.success.awaitingDecreeAbsolute);
  I.click(commonContent.en.continue);
}

function loginAsCaseDNPronounced() {
  const I = this;

  I.click(content.en.fields.success.dnPronounced);
  I.click(commonContent.en.continue);
}

function loginAsCaseAosAwaitingSol() {
  const I = this;

  I.click(content.en.fields.success.aosAwaitingSol);
  I.click(commonContent.en.continue);
}

function loginAsCorespondent() {
  const I = this;

  I.click(content.en.fields.success.corespondentLogin);
  I.click(commonContent.en.continue);
}


function loginAsCoRespNotDefending() {
  const I = this;

  I.click(content.en.fields.success.coRespNotDefending);
  I.click(commonContent.en.continue);
}

function loginAsCoRespDefendingWaitingAnswer() {
  const I = this;

  I.click(content.en.fields.success.coRespDefendingWaitingAnswer);
  I.click(commonContent.en.continue);
}

function loginAsCoRespDefendingSubmittedAnswer() {
  const I = this;

  I.click(content.en.fields.success.coRespDefendingSubmittedAnswer);
  I.click(commonContent.en.continue);
}

function loginAsCoRespTooLateToRespond() {
  const I = this;

  I.click(content.en.fields.success.coRespTooLateToRespond);
  I.click(commonContent.en.continue);
}

function loginAsCoRespAwaitingPronouncementHearingDataFuture() {
  const I = this;

  I.click(content.en.fields.success.coRespAwaitingPronouncementHearingDataFuture);
  I.click(commonContent.en.continue);
}

function loginAsCoRespDNPronouncedAndCostsOrder() {
  const I = this;

  I.click(content.en.fields.success.coRespDNPronouncedWithCosts);
  I.click(commonContent.en.continue);
}

function loginAsCoRespDNPronouncedWithoutCostsOrder() {
  const I = this;

  I.click(content.en.fields.success.coRespDNPronouncedWithoutCosts);
  I.click(commonContent.en.continue);
}

function loginAndThrowError() {
  const I = this;

  I.click(content.en.fields.success.throwError);
  I.click(commonContent.en.continue);
}


module.exports = {
  seeIdamLoginPage,
  login,
  loginCy,
  loginAsANonLinkedUser,
  loginAsInvalidPinUser,
  loginAsALinkedUser,
  loginAsNonLinkedUserAndServerError,
  loginAsAdulteryCase,
  loginAsCaseProgressedNoAos,
  loginAsCaseProgressedNotDefending,
  loginAsCaseProgressedAwaitingAnswer,
  loginAsCaseProgressedDefending,
  loginAs2yrSeparationCase,
  loginAs5yrSeparationCase,
  loginAsCorespondent,
  loginAsCoRespNotDefending,
  loginAsCoRespDefendingWaitingAnswer,
  loginAsCoRespDefendingSubmittedAnswer,
  loginAsCoRespTooLateToRespond,
  loginAsCoRespAwaitingPronouncementHearingDataFuture,
  loginAsCoRespDNPronouncedAndCostsOrder,
  loginAsCoRespDNPronouncedWithoutCostsOrder,
  loginAndThrowError,
  loginAsCaseAwaitingDecreeAbsolute,
  loginAsCaseDNPronounced,
  loginAsCaseAosAwaitingSol
};
