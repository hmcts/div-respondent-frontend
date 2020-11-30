const CrReviewApplicationPage = require('steps/co-respondent/cr-review-application/CrReviewApplication.step');
const content = require('steps/co-respondent/cr-review-application/CrReviewApplication.content');

function seeCrReviewApplicationPage(language = 'en') {
  const I = this;
  I.waitInUrl(CrReviewApplicationPage.path);
  I.seeCurrentUrlEquals(CrReviewApplicationPage.path);
  I.waitForText(content[language].issued);
}

function acknowledgeApplicationCr(language = 'en') {
  this.click(content[language].readConfirmation);
}

module.exports = {
  seeCrReviewApplicationPage,
  acknowledgeApplicationCr
};
