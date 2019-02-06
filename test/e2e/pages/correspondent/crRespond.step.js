const CrRespondPage = require('steps/correspondent/cr-respond/crRespond.step');
const content = require('steps/correspondent/cr-respond/crRespond.content');

function seeCrRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrRespondPage.path);
  I.waitForText(content.en.title);
}

module.exports = { seeCrRespondPage };
