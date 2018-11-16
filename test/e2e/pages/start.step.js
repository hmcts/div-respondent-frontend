const ExamplePage = require('steps/start/Start.step');
const content = require('steps/start/Start.content');

function seeExamplePage() {
  const I = this;

  I.seeCurrentUrlEquals(ExamplePage.path);
  I.see(content.en.start);
}


module.exports = { seeExamplePage };
