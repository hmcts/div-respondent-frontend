const ExamplePage = require('steps/start/Start.step');

function seeExamplePage() {
  const I = this;

  I.seeCurrentUrlEquals(ExamplePage.path);
  I.see('Start now');
}

module.exports = { seeExamplePage };
