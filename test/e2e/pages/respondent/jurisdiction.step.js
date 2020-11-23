const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const content = require('steps/respondent/jurisdiction/Jurisdiction.content');

function seeJurisdictionPage(language = 'en') {
  const I = this;

  I.waitInUrl(Jurisdiction.path);
  I.seeCurrentUrlEquals(Jurisdiction.path);
  I.waitForText(content[language].title);
}

function chooseAgreeToJurisdiction(language = 'en') {
  this.click(content[language].fields.agree.heading);
  this.wait(2);
}

module.exports = {
  seeJurisdictionPage,
  chooseAgreeToJurisdiction
};
