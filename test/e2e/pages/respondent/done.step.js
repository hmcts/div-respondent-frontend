const DonePage = require('steps/respondent/done/Done.step');
const content = require('steps/respondent/done/Done.content');

function seeDonePage() {
  const I = this;
  I.waitInUrl(DonePage.path, 15);
  I.seeCurrentUrlEquals(DonePage.path);
  I.waitForText(content.en.responseSent, 2);
}

module.exports = { seeDonePage };
