const CrReviewApplicationPage = require('steps/co-respondent/cr-review-application/CrReviewApplication.step');
const content = require('steps/co-respondent/cr-review-application/CrReviewApplication.content');

function seeCrReviewApplicationPage(language = 'en') {
  const I = this;
  I.seeCurrentUrlEquals(CrReviewApplicationPage.path);
  I.waitForText(content[language].title);
}

function acknowledgeApplicationCr(language = 'en') {
  this.click(content[language].readConfirmation);
}

module.exports = {
  seeCrReviewApplicationPage,
  acknowledgeApplicationCr
};
