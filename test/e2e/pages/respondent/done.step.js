const DonePage = require('steps/respondent/done/Done.step');
const content = require('steps/respondent/done/Done.content');

function seeDonePage() {
  const I = this;

  I.seeCurrentUrlEquals(DonePage.path);
  I.waitForText(content.en.responseSent);
}

module.exports = { seeDonePage };
