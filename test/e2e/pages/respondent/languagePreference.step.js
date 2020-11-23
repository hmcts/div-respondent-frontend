const languagePreference = require('steps/respondent/language-preference/LanguagePreference.step');
const content = require('steps/respondent/language-preference/LanguagePreference.content');

function seeLanguagePreferencePage(language = 'en') {
  const I = this;

  I.waitInUrl(languagePreference.path);
  I.seeCurrentUrlEquals(languagePreference.path);
  I.waitForText(content[language].title);
}

function chooseBilingualApplication(language = 'en') {
  this.click(content[language].fields.agree.heading);
}

module.exports = {
  seeLanguagePreferencePage,
  chooseBilingualApplication
};
