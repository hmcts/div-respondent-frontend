const crCheckYourAnswers = require('steps/co-respondent/cr-check-your-answers/CrCheckYourAnswers.step');
const content = require('steps/co-respondent/cr-check-your-answers/CrCheckYourAnswers.content');

function seeCrCheckYourAnswersPage(language = 'en') {
  const I = this;

  I.seeCurrentUrlEquals(crCheckYourAnswers.path);
  I.waitForText(content[language].title);
}

function confirmInformationIsTrueCr(language = 'en') {
  const I = this;
  I.click(content[language].fields.statementOfTruth.yes);
}

function submitApplicationCr(language = 'en') {
  this.click(content[language].submit);
}

module.exports = {
  seeCrCheckYourAnswersPage,
  confirmInformationIsTrueCr,
  submitApplicationCr
};
