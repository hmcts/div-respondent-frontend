const languagePreference = require('steps/respondent/languagePreference/languagePreference.step');
const content = require('steps/respondent/languagePreference/languagePreference.content');

function seeJurisdictionPage() {
  const I = this;

  I.waitInUrl(languagePreference.path, 15);
  I.seeCurrentUrlEquals(languagePreference.path);
  I.waitForText(content.en.title, 5);
}

function chooseAgreeToJurisdiction() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeJurisdictionPage,
  chooseAgreeToJurisdiction
};
