const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const content = require('steps/respondent/jurisdiction/Jurisdiction.content');

function seeJurisdictionPage(language = 'en') {
  const I = this;

  I.waitInUrl(Jurisdiction.path, 15);
  I.seeCurrentUrlEquals(Jurisdiction.path);
  I.waitForText(content[language].title, 5);
}

function chooseAgreeToJurisdiction(language = 'en') {
  this.click(content[language].fields.agree.heading);
}

module.exports = {
  seeJurisdictionPage,
  chooseAgreeToJurisdiction
};
