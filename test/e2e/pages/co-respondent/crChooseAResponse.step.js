const CrChooseAResponsePage = require('steps/co-respondent/cr-choose-a-response/CrChooseAResponse.step');
const content = require('steps/co-respondent/cr-choose-a-response/CrChooseAResponse.content');

function seeCrChooseAResponsePage(language = 'en') {
  const I = this;
  I.seeCurrentUrlEquals(CrChooseAResponsePage.path);
  I.waitForText(content[language].title);
}

function chooseCrToProceedWithDivorce(language = 'en') {
  this.click(content[language].fields.proceed.heading);
}

function chooseCrToDefendAgainstDivorce() {
  this.click(content.en.fields.defend.heading);
}

module.exports = {
  seeCrChooseAResponsePage,
  chooseCrToProceedWithDivorce,
  chooseCrToDefendAgainstDivorce
};
