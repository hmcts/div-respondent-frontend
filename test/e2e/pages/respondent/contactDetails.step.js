const ContactDetails = require('steps/respondent/contact-details/ContactDetails.step');
const content = require('steps/respondent/contact-details/ContactDetails.content');

function seeContactDetailsPage() {
  const I = this;
  I.waitInUrl(ContactDetails.path, 15);
  I.seeCurrentUrlEquals(ContactDetails.path);
  I.waitForText(content.en.title, 5);
}

function consentToSendingNotifications() {
  this.click(content.en.fields.email.label);
}

module.exports = {
  seeContactDetailsPage,
  consentToSendingNotifications
};
