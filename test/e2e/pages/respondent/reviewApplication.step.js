const ReviewApplicationPage = require('steps/respondent/review-application/ReviewApplication.step');
const content = require('steps/respondent/review-application/ReviewApplication.content');

function seeReviewApplicationPage() {
  const I = this;
  I.waitInUrl(ReviewApplicationPage.path, 5);
  I.seeCurrentUrlEquals(ReviewApplicationPage.path);
  I.waitForText(content.en.title, 5);
}

function acknowledgeApplication() {
  this.click(content.en.readConfirmation);
}

module.exports = {
  seeReviewApplicationPage,
  acknowledgeApplication
};
