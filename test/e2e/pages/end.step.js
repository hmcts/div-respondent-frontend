const EndPage = require('steps/end/End.step');
const content = require('steps/End/End.content');

function seeEndPage() {
  const I = this;

  I.seeCurrentUrlEquals(EndPage.path);
  I.see(content.en.title);
}

module.exports = { seeEndPage };
