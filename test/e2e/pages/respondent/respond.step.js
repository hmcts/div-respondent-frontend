const RespondPage = require('steps/respondent/respond/Respond.step');
const content = require('steps/respondent/respond/Respond.content');

function seeRespondPage(language = 'en') {
  const I = this;
  I.waitInUrl(RespondPage.path, 15);
  I.seeCurrentUrlEquals(RespondPage.path);
  I.waitForText(content[language].title, 2);
}

function seeDocumentsForDownload() {
  const I = this;
  I.waitForText(content.en.files.dpetition);
  I.waitForText(content.en.files.coRespondentAnswers);
  I.waitForText(content.en.files.certificateOfEntitlement);
}

module.exports = { seeRespondPage, seeDocumentsForDownload };
