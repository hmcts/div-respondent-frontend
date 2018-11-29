const FinancialSituation = require('steps/financial-situation/FinancialSituation.step');
const content = require('steps/financial-situation/FinancialSituation.content');

function seeFinancialSituationPage() {
  const I = this;

  I.seeCurrentUrlEquals(FinancialSituation.path);
  I.waitForText(content.en.title);
}

function clickToConsiderFinancialSituation() {
  this.click(content.en.fields.respConsiderFinancialSituation.yes);
}

function clickToNotConsiderFinancialSituation() {
  this.click(content.en.fields.respConsiderFinancialSituation.no);
}

module.exports = {
  seeFinancialSituationPage,
  clickToConsiderFinancialSituation,
  clickToNotConsiderFinancialSituation
};