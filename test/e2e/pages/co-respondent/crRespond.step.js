const CrRespondPage = require('steps/co-respondent/cr-respond/CrRespond.step');
const content = require('steps/co-respondent/cr-respond/CrRespond.content');

function seeCrRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrRespondPage.path);
  I.waitForText(content.en.title);
}

module.exports = { seeCrRespondPage };
