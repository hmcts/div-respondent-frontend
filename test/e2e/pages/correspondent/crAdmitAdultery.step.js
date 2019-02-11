const AdmitAdulteryPage = require('steps/correspondent/cr-admit-adultery/CrAdmitAdultery.step');
const content = require('steps/correspondent/cr-admit-adultery/CrAdmitAdultery.content');

function seeCrAdmitAdulteryPage() {
  const I = this;

  I.seeCurrentUrlEquals(AdmitAdulteryPage.path);
  I.waitForText(content.en.title);
}

function clickToCrAdmitAdultery() {
  this.click(content.en.fields.admit.label);
}

function clickToCrNotAdmitAdultery() {
  this.click(content.en.fields.doNotAdmit.label);
}

module.exports = {
  seeCrAdmitAdulteryPage,
  clickToCrAdmitAdultery,
  clickToCrNotAdmitAdultery
};