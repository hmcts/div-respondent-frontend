const ReviewApplicationPage = require('steps/respondent/review-application/ReviewApplication.step');
const content = require('steps/respondent/review-application/ReviewApplication.content');

function seeReviewApplicationPage() {
  const I = this;

  I.seeCurrentUrlEquals(ReviewApplicationPage.path);
  I.waitForText(content.en.title);
}

function acknowledgeApplication() {
  this.click(content.en.readConfirmation);
}

module.exports = {
  seeReviewApplicationPage,
  acknowledgeApplication
};
