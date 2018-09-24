const CheckYourAnswersPage = require('steps/check-your-answers/CheckYourAnswers.step');
const content = require('steps/check-your-answers/CheckYourAnswers.content');

function seeCheckYourAnswersPage() {
  const I = this;

  I.seeCurrentUrlEquals(CheckYourAnswersPage.path);
  I.see(content.en.title);
}

function submitApplication() {
  this.click(content.en.submit);
}

module.exports = {
  seeCheckYourAnswersPage,
  submitApplication
};
