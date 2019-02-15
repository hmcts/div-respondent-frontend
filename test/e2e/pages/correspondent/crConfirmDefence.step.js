const CrConfirmDefencePage = require(
  'steps/correspondent/cr-confirm-defence/CrConfirmDefence.step'
);
const content = require('steps/correspondent/cr-confirm-defence/CrConfirmDefence.content');

function seeCrConfirmDefencePage() {
  const I = this;

  I.seeCurrentUrlEquals(CrConfirmDefencePage.path);
  I.waitForText(content.en.title);
}

function clickCrToConfirmDefenceAgainstDivorce() {
  this.click(content.en.fields.confirm.label);
}

function clickCrToChangeResponse() {
  this.click(content.en.fields.changeResponse.label);
}

module.exports = {
  seeCrConfirmDefencePage,
  clickCrToConfirmDefenceAgainstDivorce,
  clickCrToChangeResponse
};