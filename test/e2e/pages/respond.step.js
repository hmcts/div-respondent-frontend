const RespondPage = require('steps/respond/Respond.step');
const content = require('steps/respond/Respond.content');

function seeRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondPage.path);
  I.waitForText(content.en.title, 10);
}

module.exports = { seeRespondPage };
