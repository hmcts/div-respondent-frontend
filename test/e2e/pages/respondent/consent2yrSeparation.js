const ConsentDecree = require('steps/respondent/consent-decree/ConsentDecree.step');
const content = require('steps/respondent/consent-decree/ConsentDecree.content');

function seeConsentDecreePage(language = 'en') {
  const I = this;

  I.seeCurrentUrlEquals(ConsentDecree.path);
  I.waitForText(content[language].title);
}

function clickToConsentToDivorce(language = 'en') {
  this.click(content[language].fields.consentDecree.labelYes);
}

function clickToNotConsentDivorce(language = 'en') {
  this.click(content[language].fields.consentDecree.labelNo);
}

function clickToDefendDivorce(language = 'en') {
  this.click(content[language].fields.willDefend.labelYes);
}

function clickToNotDefendDivorce(language = 'en') {
  this.click(content[language].fields.willDefend.labelNo);
}

module.exports = {
  seeConsentDecreePage,
  clickToConsentToDivorce,
  clickToNotConsentDivorce,
  clickToDefendDivorce,
  clickToNotDefendDivorce
};
