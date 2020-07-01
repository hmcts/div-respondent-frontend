const languagePreference = require('steps/respondent/language-preference/LanguagePreference.step');
const content = require('steps/respondent/language-preference/LanguagePreference.content');

function seeLanguagePreferencePage() {
  const I = this;

  I.waitInUrl(languagePreference.path, 15);
  I.seeCurrentUrlEquals(languagePreference.path);
  I.waitForText(content.en.title, 5);
}

function chooseBilingualApplication() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeLanguagePreferencePage,
  chooseBilingualApplication
};
