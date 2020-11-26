const ChooseAResponsePage = require('steps/respondent/choose-a-response/ChooseAResponse.step');
const content = require('steps/respondent/choose-a-response/ChooseAResponse.content');

function seeChooseAResponsePage(language = 'en') {
  const I = this;

  I.waitInUrl(ChooseAResponsePage.path);
  I.seeCurrentUrlEquals(ChooseAResponsePage.path);
  I.waitForText(content[language].title);
}

function chooseToProceedWithDivorce(language = 'en') {
  this.click(content[language].fields.proceed.heading);
}

function chooseToDefendAgainstDivorce(language = 'en') {
  this.click(content[language].fields.defend.heading);
}

module.exports = {
  seeChooseAResponsePage,
  chooseToProceedWithDivorce,
  chooseToDefendAgainstDivorce
};
