const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const content = require('steps/respondent/jurisdiction/Jurisdiction.content');

function seeJurisdictionPage() {
  const I = this;

  I.waitInUrl(Jurisdiction.path, 5);
  I.seeCurrentUrlEquals(Jurisdiction.path);
  I.waitForText(content.en.title, 5);
}

function chooseAgreeToJurisdiction() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeJurisdictionPage,
  chooseAgreeToJurisdiction
};
