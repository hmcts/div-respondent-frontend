const ContactDetails = require('steps/contact-details/ContactDetails.step');
const content = require('steps/contact-details/ContactDetails.content');

function seeContactDetailsPage() {
  const I = this;

  I.seeCurrentUrlEquals(ContactDetails.path);
  I.waitForText(content.en.title);
}

function consentToSendingNotifications() {
  this.click(content.en.fields.email.label);
}

module.exports = {
  seeContactDetailsPage,
  consentToSendingNotifications
};
