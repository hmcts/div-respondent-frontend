const ChooseAResponsePage = require('steps/choose-a-response/ChooseAResponse.step');
const content = require('steps/choose-a-response/ChooseAResponse.content');

function seeChooseAResponsePage() {
  const I = this;

  I.seeCurrentUrlEquals(ChooseAResponsePage.path);
  I.waitForText(content.en.title);
}

function chooseToProceedWithDivorce() {
  this.click(content.en.fields.proceed.heading);
}

function chooseToDefendAgainstDivorce() {
  this.click(content.en.fields.defend.heading);
}

module.exports = {
  seeChooseAResponsePage,
  chooseToProceedWithDivorce,
  chooseToDefendAgainstDivorce
};
