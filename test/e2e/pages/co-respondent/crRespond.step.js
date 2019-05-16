const CrRespondPage = require('steps/co-respondent/cr-respond/CrRespond.step');
const content = require('steps/co-respondent/cr-respond/CrRespond.content');

function seeCrRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(CrRespondPage.path);
  I.waitForText(content.en.title);
}

function seeCrDocumentsForDownload() {
  const I = this;
  I.waitForText(content.en.files.dpetition);
}

module.exports = {
  seeCrRespondPage,
  seeCrDocumentsForDownload
};
