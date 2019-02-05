const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const content = require('steps/respondent/jurisdiction/Jurisdiction.content');

function seeJurisdictionPage() {
  const I = this;

  I.seeCurrentUrlEquals(Jurisdiction.path);
  I.waitForText(content.en.title);
}

function chooseAgreeToJurisdiction() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeJurisdictionPage,
  chooseAgreeToJurisdiction
};
