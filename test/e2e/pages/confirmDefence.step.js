const ConfirmDefencePage = require('steps/confirm-defence/ConfirmDefence.step');
const content = require('steps/confirm-defence/ConfirmDefence.content');

function seeConfirmDefencePage() {
  const I = this;

  I.seeCurrentUrlEquals(ConfirmDefencePage.path);
  I.waitForText(content.en.title);
}

function clickToConfirmDefenceAgainstDivorce() {
  this.click(content.en.fields.confirm.label);
}

function clickToChangeResponse() {
  this.click(content.en.fields.changeResponse.label);
}

module.exports = {
  seeConfirmDefencePage,
  clickToConfirmDefenceAgainstDivorce,
  clickToChangeResponse
};