const CheckYourAnswersPage = require('steps/respondent/check-your-answers/CheckYourAnswers.step');
const content = require('steps/respondent/check-your-answers/CheckYourAnswers.content');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');

function seeCheckYourAnswersPage(language = 'en') {
  const I = this;
  I.waitInUrl(CheckYourAnswersPage.path, 15);
  I.seeCurrentUrlEquals(CheckYourAnswersPage.path);
  I.waitForText(content[language].title, 5);
}

function confirmInformationIsTrue(language = 'en') {
  const I = this;
  if (parseBool(config.features.respSolicitorDetails)) {
    I.click(content[language].fields.respondentSolicitorRepresented.yes);
  } else {
    I.click(content[language].fields.statementOfTruth.yes);
  }
}

function submitApplication(language = 'en') {
  this.click(content[language].submit);
}

module.exports = {
  seeCheckYourAnswersPage,
  confirmInformationIsTrue,
  submitApplication
};
