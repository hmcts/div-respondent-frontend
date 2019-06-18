const RespondPage = require('steps/respondent/respond/Respond.step');
const content = require('steps/respondent/respond/Respond.content');

function seeRespondPage() {
  const I = this;

  I.seeCurrentUrlEquals(RespondPage.path);
  I.waitForText(content.en.title);
}

function seeDocumentsForDownload() {
  const I = this;
  I.waitForText(content.en.files.dpetition);
  I.waitForText(content.en.files.coRespondentAnswers);
  I.waitForText(content.en.files.certificateOfEntitlement);
  I.waitForText(content.en.files.costsOrder);
}

module.exports = { seeRespondPage, seeDocumentsForDownload };
