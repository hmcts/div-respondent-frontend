const AgreeToPayCosts = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.step');
const content = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.content');

function seeAgreeToPayCostsPage() {
  const I = this;
  I.waitInUrl(AgreeToPayCosts.path, 15);
  I.seeCurrentUrlEquals(AgreeToPayCosts.path);
  I.waitForText(content.en.title, 2);
}

function chooseAgreeToPay() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeAgreeToPayCostsPage,
  chooseAgreeToPay
};
