const CrContactDetails = require('steps/co-respondent/cr-contact-details/CrContactDetails.step');
const content = require('steps/co-respondent/cr-contact-details/CrContactDetails.content');

function seeCrContactDetailsPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrContactDetails.path);
  I.waitForText(content.en.title);
}

function consentToSendingCrNotifications() {
  this.click(content.en.fields.email.label);
}

module.exports = {
  seeCrContactDetailsPage,
  consentToSendingCrNotifications
};
