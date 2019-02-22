const crCheckYourAnswers = require(
  'steps/co-respondent/cr-check-your-answers/CrCheckYourAnswers.step'
);

const content = require('steps/co-respondent/cr-check-your-answers/CrCheckYourAnswers.content');

function seeCrCheckYourAnswersPage() {
  const I = this;

  I.seeCurrentUrlEquals(crCheckYourAnswers.path);
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
  seeCrCheckYourAnswersPage,
  confirmInformationIsTrue,
  submitApplication
};
