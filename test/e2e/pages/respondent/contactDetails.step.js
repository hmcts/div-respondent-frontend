const ContactDetails = require('steps/respondent/contact-details/ContactDetails.step');
const content = require('steps/respondent/contact-details/ContactDetails.content');

function seeContactDetailsPage(language = 'en') {
  const I = this;
  I.waitInUrl(ContactDetails.path);
  I.seeCurrentUrlEquals(ContactDetails.path);
  I.waitForText(content[language].title);
}

function consentToSendingNotifications(language = 'en') {
  this.click(content[language].fields.email.label);
}

module.exports = {
  seeContactDetailsPage,
  consentToSendingNotifications
};
