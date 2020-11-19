const languagePreference = require('steps/respondent/language-preference/LanguagePreference.step');
const content = require('steps/respondent/language-preference/LanguagePreference.content');

function seeLanguagePreferencePage(language = 'en') {
  const I = this;

  I.waitInUrl(languagePreference.path, 15);
  I.seeCurrentUrlEquals(languagePreference.path);
  I.waitForText(content[language].title, 5);
}

function chooseBilingualApplication(language = 'en') {
  this.click(content[language].fields.agree.heading);
}

module.exports = {
  seeLanguagePreferencePage,
  chooseBilingualApplication
};
