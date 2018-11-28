const ConsentDecree = require('steps/consent-decree/ConsentDecree.step');
const content = require('steps/consent-decree/ConsentDecree.content');

function seeConsentDecreePage() {
  const I = this;

  I.seeCurrentUrlEquals(ConsentDecree.path);
  I.waitForText(content.en.title);
}

function clickToConsentToDivorce() {
  this.click(content.en.fields.consentDecree.labelYes);
}

function clickToNotConsentDivorce() {
  this.click(content.en.fields.consentDecree.labelNo);
}

function clickToDefendDivorce() {
  this.click(content.en.fields.willDefend.labelYes);
}

function clickToNotDefendDivorce() {
  this.click(content.en.fields.willDefend.labelNo);
}

module.exports = {
  seeConsentDecreePage,
  clickToConsentToDivorce,
  clickToNotConsentDivorce,
  clickToDefendDivorce,
  clickToNotDefendDivorce
};