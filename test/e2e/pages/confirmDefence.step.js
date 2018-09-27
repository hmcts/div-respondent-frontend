const ConfirmDefencePage = require('steps/confirm-defence/ConfirmDefence.step');
const content = require('steps/confirm-defence/ConfirmDefence.content');

function seeConfirmDefencePage() {
  const I = this;

  I.seeCurrentUrlEquals(ConfirmDefencePage.path);
  I.see(content.en.title);
}

function clickToConfirmDefenceAgainstDivorce() {
  this.click(content.en.fields.confirm.heading);
}

function clickToChangeResponse() {
  this.click(content.en.fields.changeResponse.heading);
}

module.exports = {
  seeConfirmDefencePage,
  clickToConfirmDefenceAgainstDivorce,
  clickToChangeResponse
};