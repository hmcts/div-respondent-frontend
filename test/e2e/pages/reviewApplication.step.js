const ReviewApplicationPage = require('steps/review-application/ReviewApplication.step');
const content = require('steps/review-application/ReviewApplication.content');

function seeReviewApplicationPage() {
  const I = this;

  I.seeCurrentUrlEquals(ReviewApplicationPage.path);
  I.see(content.en.title);
}

function acknowledgeApplication() {
  this.click(content.en.readConfirmation);
}

module.exports = {
  seeReviewApplicationPage,
  acknowledgeApplication
};
