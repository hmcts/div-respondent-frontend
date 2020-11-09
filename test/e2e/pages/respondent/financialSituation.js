const FinancialSituation = require('steps/respondent/financial-situation/FinancialSituation.step');
const content = require('steps/respondent/financial-situation/FinancialSituation.content');

function seeFinancialSituationPage(language = 'en') {
  const I = this;

  I.seeCurrentUrlEquals(FinancialSituation.path);
  I.waitForText(content[language].title);
}

function clickToConsiderFinancialSituation(language = 'en') {
  this.click(content[language].fields.respConsiderFinancialSituation.yes);
}

function clickToNotConsiderFinancialSituation(language = 'en') {
  this.click(content[language].fields.respConsiderFinancialSituation.no);
}

module.exports = {
  seeFinancialSituationPage,
  clickToConsiderFinancialSituation,
  clickToNotConsiderFinancialSituation
};
