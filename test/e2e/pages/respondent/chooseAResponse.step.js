const ChooseAResponsePage = require('steps/respondent/choose-a-response/ChooseAResponse.step');
const content = require('steps/respondent/choose-a-response/ChooseAResponse.content');

function seeChooseAResponsePage() {
  const I = this;

  I.waitInUrl(ChooseAResponsePage.path,10);
  I.seeCurrentUrlEquals(ChooseAResponsePage.path);
  I.waitForText(content.en.title,2);
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
