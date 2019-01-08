function seeErrorContent() {
  const I = this;

  I.see('Please try again in a few minutes.');
  I.see('You can contact us if the problem continues.');
  I.see('Phone: 0300 303 0642 (Monday to Friday, 8.30am to 5pm)');
  I.see('Email: divorce@justice.gov.uk');
}

module.exports = {
  seeErrorContent
};
