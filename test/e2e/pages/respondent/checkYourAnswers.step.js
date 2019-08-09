const CheckYourAnswersPage = require('steps/respondent/check-your-answers/CheckYourAnswers.step');
const content = require('steps/respondent/check-your-answers/CheckYourAnswers.content');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page');

function seeCheckYourAnswersPage() {
  const I = this;
  I.waitInUrl(CheckYourAnswersPage.path,5);
  I.seeCurrentUrlEquals(CheckYourAnswersPage.path);
  I.waitForText(content.en.title,5);
}

function confirmInformationIsTrue() {
  const I = this;
  if (parseBool(config.features.respSolicitorDetails)) {
    I.click(content.en.fields.respondentSolicitorRepresented.yes);
  } else {
    I.click(content.en.fields.statementOfTruth.yes);
  }
}

function submitApplication() {
  this.click(content.en.submit);
}

module.exports = {
  seeCheckYourAnswersPage,
  confirmInformationIsTrue,
  submitApplication
};
