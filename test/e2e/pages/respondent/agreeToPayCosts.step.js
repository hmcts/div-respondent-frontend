const AgreeToPayCosts = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.step');
const content = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.content');

function seeAgreeToPayCostsPage(language = 'en') {
  const I = this;
  I.waitInUrl(AgreeToPayCosts.path);
  I.seeCurrentUrlEquals(AgreeToPayCosts.path);
  I.waitForText(content[language].title);
}

function chooseAgreeToPay(language = 'en') {
  this.click(content[language].fields.agree.heading);
}

module.exports = {
  seeAgreeToPayCostsPage,
  chooseAgreeToPay
};
