const RespondPage = require('steps/respond/Respond.step');

function seeRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondPage.path);
  I.see('Your divorce');
}

module.exports = { seeRespondPage };
