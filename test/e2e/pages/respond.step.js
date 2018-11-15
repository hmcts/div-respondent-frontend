const RespondPage = require('steps/respond/Respond.step');
const content = require('steps/respond/Respond.content');

async function seeRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondPage.path);
  await I.waitForText(content.en.title, 15);
}

module.exports = { seeRespondPage };
