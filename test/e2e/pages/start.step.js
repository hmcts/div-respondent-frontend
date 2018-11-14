const ExamplePage = require('steps/start/Start.step');
const content = require('steps/start/Start.content');

function seeExamplePage() {
  const I = this;

  I.seeCurrentUrlEquals(ExamplePage.path);
  I.waitForText(content.en.start, 10);
}

module.exports = { seeExamplePage };
