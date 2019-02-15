const crCheckYourAnswers = require(
  'steps/correspondent/cr-check-your-answers/CrCheckYourAnswers.step'
);

const content = require('steps/correspondent/cr-check-your-answers/CrCheckYourAnswers.content');

function seeCrCheckYourAnswersPage() {
  const I = this;

  I.seeCurrentUrlEquals(crCheckYourAnswers.path);
  I.waitForText(content.en.title);
}

function confirmInformationIsTrue() {
  const I = this;
  I.click(content.en.fields.statementOfTruth.yes);
}

module.exports = {
  seeCrCheckYourAnswersPage,
  confirmInformationIsTrue
};
