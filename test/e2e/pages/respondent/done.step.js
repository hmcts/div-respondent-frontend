const DonePage = require('steps/respondent/done/Done.step');
const content = require('steps/respondent/done/Done.content');

function seeDonePage(language = 'en') {
  const I = this;
  I.waitInUrl(DonePage.path);
  I.seeInCurrentUrl(DonePage.path);
  I.waitForText(content[language].responseSent);
}

module.exports = { seeDonePage };
