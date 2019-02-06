const CrRespondPage = require('steps/correspondent/cr-respond/CrRespond.step');
const content = require('steps/correspondent/cr-respond/CrRespond.content');

function seeCrRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrRespondPage.path);
  I.waitForText(content.en.title);
}

module.exports = { seeCrRespondPage };
