const CrReviewApplicationPage = require(
  'steps/co-respondent/cr-review-application/CrReviewApplication.step'
);
const content = require('steps/co-respondent/cr-review-application/CrReviewApplication.content');

function seeCrReviewApplicationPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrReviewApplicationPage.path);
  I.waitForText(content.en.title);
}

function acknowledgeApplication() {
  this.click(content.en.readConfirmation);
}

module.exports = {
  seeCrReviewApplicationPage,
  acknowledgeApplication
};
