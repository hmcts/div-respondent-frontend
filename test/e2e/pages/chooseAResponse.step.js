const ChooseAResponsePage = require('steps/choose-a-response/ChooseAResponse.step');
const content = require('steps/choose-a-response/ChooseAResponse.content');

function seeChooseAResponsePage() {
  const I = this;

  I.seeCurrentUrlEquals(ChooseAResponsePage.path);
  I.see(content.en.title);
}

function chooseToProceedWithDivorce() {
  this.click(content.en.fields.proceed.heading);
}

module.exports = {
  seeChooseAResponsePage,
  chooseToProceedWithDivorce
};
