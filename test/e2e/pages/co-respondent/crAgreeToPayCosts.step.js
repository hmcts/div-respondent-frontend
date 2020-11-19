const CrAgreeToPayCosts = require('steps/co-respondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.step');
const content = require('steps/co-respondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.content');

function seeCrAgreeToPayCostsPage(language = 'en') {
  const I = this;
  I.seeCurrentUrlEquals(CrAgreeToPayCosts.path);
  I.waitForText(content[language].title);
}

function chooseCrAgreeToPay(language = 'en') {
  this.click(content[language].fields.agree.heading);
}

module.exports = {
  seeCrAgreeToPayCostsPage,
  chooseCrAgreeToPay
};
