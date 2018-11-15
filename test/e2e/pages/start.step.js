const ExamplePage = require('steps/start/Start.step');
const content = require('steps/start/Start.content');

async function seeExamplePage() {
  const I = this;

  I.seeCurrentUrlEquals(ExamplePage.path);
  await I.waitForText(content.en.start, 15);
}

module.exports = { seeExamplePage };
