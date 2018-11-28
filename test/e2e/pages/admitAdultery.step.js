const ConfirmDefencePage = require('steps/admit-adultery/AdmitAdultery.step');
const content = require('steps/admit-adultery/AdmitAdultery.content');

function seeAdmitAdulteryPage() {
  const I = this;

  I.seeCurrentUrlEquals(ConfirmDefencePage.path);
  I.waitForText(content.en.title);
}

function clickToAdmitAdultery() {
  this.click(content.en.fields.admit.label);
}

function clickToNotAdmitAdultery() {
  this.click(content.en.fields.doNotAdmit.label);
}

module.exports = {
  seeAdmitAdulteryPage,
  clickToAdmitAdultery,
  clickToNotAdmitAdultery
};