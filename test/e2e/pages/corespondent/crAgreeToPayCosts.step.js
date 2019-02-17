const CrAgreeToPayCosts = require(
  'steps/corespondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.step'
);
const content = require('steps/corespondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.content');

function seeCrAgreeToPayCostsPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrAgreeToPayCosts.path);
  I.waitForText(content.en.title);
}

function chooseCrAgreeToPay() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeCrAgreeToPayCostsPage,
  chooseCrAgreeToPay
};
