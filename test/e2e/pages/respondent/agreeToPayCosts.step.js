const AgreeToPayCosts = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.step');
const content = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.content');

function seeAgreeToPayCostsPage() {
  const I = this;

  I.seeCurrentUrlEquals(AgreeToPayCosts.path);
  I.waitForText(content.en.title);
}

function chooseAgreeToPay() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeAgreeToPayCostsPage,
  chooseAgreeToPay
};
