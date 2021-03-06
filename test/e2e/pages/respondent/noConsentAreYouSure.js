const NoConsentAreYouSure = require(
  'steps/respondent/no-consent-are-you-sure/NoConsentAreYouSure.step'
);
const content = require(
  'steps/respondent/no-consent-are-you-sure/NoConsentAreYouSure.content'
);

function seeNoConsentAreYouSurePage() {
  const I = this;

  I.seeCurrentUrlEquals(NoConsentAreYouSure.path);
  I.waitForText(content.en.title);
}

function clickToConfirmNoConsent() {
  this.click(content.en.fields.confirm.label);
}

function clickToNotConfirmNoConsent() {
  this.click(content.en.fields.doNotConfirm.label);
}

module.exports = {
  seeNoConsentAreYouSurePage,
  clickToConfirmNoConsent,
  clickToNotConfirmNoConsent
};