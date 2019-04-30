const modulePath = 'steps/respondent/defend-financial-hardship/DefendFinancialHardship.step';
const DefendFinancialHardship = require(modulePath);
const content = require(
  'steps/respondent/defend-financial-hardship/DefendFinancialHardship.content'
);

function seeDefendFinancialHardShipPage() {
  const I = this;

  I.seeCurrentUrlEquals(DefendFinancialHardship.path);
  I.waitForText(content.en.title);
}

function clickNoToHardShipQuestion() {
  this.click(content.en.fields.no.heading);
}

module.exports = {
  seeDefendFinancialHardShipPage,
  clickNoToHardShipQuestion
};