const CrContactDetails = require('steps/co-respondent/cr-contact-details/CrContactDetails.step');
const content = require('steps/co-respondent/cr-contact-details/CrContactDetails.content');

function seeCrContactDetailsPage(language = 'en') {
  const I = this;

  I.seeCurrentUrlEquals(CrContactDetails.path);
  I.waitForText(content[language].title);
}

function consentToSendingCrNotifications(language = 'en') {
  this.click(content[language].fields.email.label);
}

module.exports = {
  seeCrContactDetailsPage,
  consentToSendingCrNotifications
};
