const ContactDetails = require('steps/contact-details/ContactDetails.step');
const content = require('steps/contact-details/ContactDetails.content');

function seeContactDetailsPage() {
  const I = this;

  I.seeCurrentUrlEquals(ContactDetails.path);
  I.see(content.en.title);
}

function enterPhoneNumber() {
  this.fillField('#contentDetails-phoneNo', '07557277522');
}

function consentToSendingNotifications() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeContactDetailsPage,
  enterPhoneNumber,
  consentToSendingNotifications
};
