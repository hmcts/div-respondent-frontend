const CrRespondPage = require('steps/co-respondent/cr-respond/CrRespond.step');
const content = require('steps/co-respondent/cr-respond/CrRespond.content');

function seeCrRespondPage(language = 'en') {
  const I = this;
  I.waitInUrl(CrRespondPage.path);
  I.seeCurrentUrlEquals(CrRespondPage.path);
  I.waitForText(content[language].readApplication);
}

function seeCrDocumentsForDownload(language = 'en') {
  const I = this;
  I.waitForText(content[language].files.dpetition);
  I.waitForText(content[language].files.certificateOfEntitlement);
}

module.exports = {
  seeCrRespondPage,
  seeCrDocumentsForDownload
};
