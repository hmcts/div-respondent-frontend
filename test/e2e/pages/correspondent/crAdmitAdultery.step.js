const AdmitAdulteryPage = require('steps/corespondent/cr-admit-adultery/CrAdmitAdultery.step');
const content = require('steps/corespondent/cr-admit-adultery/CrAdmitAdultery.content');

function seeCrAdmitAdulteryPage() {
  const I = this;

  I.seeCurrentUrlEquals(AdmitAdulteryPage.path);
  I.waitForText(content.en.title);
}

function clickCrToAdmitAdultery() {
  this.click(content.en.fields.admit.label);
}

function clickCrToNotAdmitAdultery() {
  this.click(content.en.fields.doNotAdmit.label);
}

module.exports = {
  seeCrAdmitAdulteryPage,
  clickCrToAdmitAdultery,
  clickCrToNotAdmitAdultery
};