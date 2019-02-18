const CrChooseAResponsePage = require(
  'steps/co-respondent/cr-choose-a-response/CrChooseAResponse.step'
);
const content = require('steps/co-respondent/cr-choose-a-response/CrChooseAResponse.content');

function seeCrChooseAResponsePage() {
  const I = this;

  I.seeCurrentUrlEquals(CrChooseAResponsePage.path);
  I.waitForText(content.en.title);
}

function chooseCrToProceedWithDivorce() {
  this.click(content.en.fields.proceed.heading);
}

function chooseCrToDefendAgainstDivorce() {
  this.click(content.en.fields.defend.heading);
}

module.exports = {
  seeCrChooseAResponsePage,
  chooseCrToProceedWithDivorce,
  chooseCrToDefendAgainstDivorce
};
