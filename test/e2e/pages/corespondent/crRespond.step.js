const CrRespondPage = require('steps/corespondent/cr-respond/CrRespond.step');
const content = require('steps/corespondent/cr-respond/CrRespond.content');

function seeCrRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrRespondPage.path);
  I.waitForText(content.en.title);
}

module.exports = { seeCrRespondPage };
