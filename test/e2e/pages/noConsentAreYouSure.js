const NoConsentAreYouSure = require('steps/no-consent-are-you-sure/NoConsentAreYouSure.step');
const content = require('steps/no-consent-are-you-sure/NoConsentAreYouSure.content');

function seeNoConsentAreYouSurePage() {
  const I = this;

  I.seeCurrentUrlEquals(NoConsentAreYouSure.path);
  I.see(content.en.title);
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