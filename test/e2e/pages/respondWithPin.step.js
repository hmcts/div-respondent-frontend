const RespondWithPinPage = require('steps/respond-with-pin/RespondWithPin.step');
const content = require('steps/respond-with-pin/RespondWithPin.content');

function seeRespondWithPinPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondWithPinPage.path);
  I.see(content.en.title);
}

module.exports = { seeRespondWithPinPage };
