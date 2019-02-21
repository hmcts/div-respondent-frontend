const RespondPage = require('steps/respondent/respond/Respond.step');
const content = require('steps/respondent/respond/Respond.content');

function seeRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondPage.path);
  I.waitForText(content.en.title);
}

module.exports = { seeRespondPage };
