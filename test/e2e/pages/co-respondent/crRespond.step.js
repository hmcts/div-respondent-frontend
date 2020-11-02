const content = require('steps/co-respondent/cr-respond/CrRespond.content');

function seeCrRespondPage() {
  const I = this;

  I.seeInCurrentUrl('/respond');
  I.waitForText(content.en.title);
}

function seeCrDocumentsForDownload() {
  const I = this;
  I.waitForText(content.en.files.dpetition);
  I.waitForText(content.en.files.certificateOfEntitlement);
}

module.exports = {
  seeCrRespondPage,
  seeCrDocumentsForDownload
};
