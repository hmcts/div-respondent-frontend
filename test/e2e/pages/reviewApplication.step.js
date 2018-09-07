const ReviewApplicationPage = require('steps/review-application/ReviewApplication.step');

function seeReviewApplicationPage() {
  const I = this;

  I.seeCurrentUrlEquals(ReviewApplicationPage.path);
  I.see('Application for divorce');
}

function acknowledgeApplication() {
  this.click('I have read the application for divorce.');
}

module.exports = {
  seeReviewApplicationPage,
  acknowledgeApplication
};
