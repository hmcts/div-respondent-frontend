const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const content = require('steps/jurisdiction/Jurisdiction.content');

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
