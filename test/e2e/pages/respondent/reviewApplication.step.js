const ReviewApplicationPage = require('steps/respondent/review-application/ReviewApplication.step');
const content = require('steps/respondent/review-application/ReviewApplication.content');

function seeReviewApplicationPage(language = 'en') {
  const I = this;
  I.waitInUrl(ReviewApplicationPage.path);
  I.seeCurrentUrlEquals(ReviewApplicationPage.path);
  I.waitForText(content[language].title);
}

function acknowledgeApplication(language = 'en') {
  this.click(content[language].readConfirmation);
}

module.exports = {
  seeReviewApplicationPage,
  acknowledgeApplication
};
