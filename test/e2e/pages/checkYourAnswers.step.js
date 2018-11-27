const CheckYourAnswersPage = require('steps/check-your-answers/CheckYourAnswers.step');
const content = require('steps/check-your-answers/CheckYourAnswers.content');

function seeCheckYourAnswersPage() {
  const I = this;

  I.seeCurrentUrlEquals(CheckYourAnswersPage.path);
  I.waitForText(content.en.title);
}

function confirmInformationIsTrue() {
  const I = this;
  I.click(content.en.fields.statementOfTruth.yes);
}

function submitApplication() {
  this.click(content.en.submit);
}

module.exports = {
  seeCheckYourAnswersPage,
  confirmInformationIsTrue,
  submitApplication
};
