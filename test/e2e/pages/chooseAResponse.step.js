const ChooseAResponsePage = require('steps/choose-a-response/ChooseAResponse.step');

function seeChooseAResponsePage() {
  const I = this;

  I.seeCurrentUrlEquals(ChooseAResponsePage.path);
  I.see('How do you want to respond?');
}

function chooseToProceedWithDivorce() {
  this.click('I will let the divorce proceed');
}

module.exports = {
  seeChooseAResponsePage,
  chooseToProceedWithDivorce
};
