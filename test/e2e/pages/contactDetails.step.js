const ContactDetails = require('steps/contact-details/AgreeToPayCosts.step');
const content = require('steps/agree-to-pay-costs/AgreeToPayCosts.content');

function seeContactDetailsPage() {
  const I = this;

  I.seeCurrentUrlEquals(ContactDetails.path);
  I.see(content.en.title);
}

function enterPhoneNumber() {
  this.fillField(content.en.fields.content.heading, '07557277522');
}

function consentToSendNotifications() {
  this.click(content.en.fields.agree.heading);
}

module.exports = {
  seeContactDetailsPage,
  enterPhoneNumber,
  consentToSendNotifications
};
