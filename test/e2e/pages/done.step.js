const DonePage = require('steps/done/Done.step');
const content = require('steps/done/Done.content');

function seeDonePage() {
  const I = this;

  I.seeCurrentUrlEquals(DonePage.path);
  I.waitForText(content.en.responseSent);
}

module.exports = { seeDonePage };
