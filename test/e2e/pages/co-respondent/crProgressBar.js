const ProgressBar = require('steps/co-respondent/cr-progress-bar/CrProgressBar.step');
const content = require('steps/co-respondent/cr-progress-bar/CrProgressBar.content');

function seeCrProgressBarPage() {
  const I = this;

  I.seeCurrentUrlEquals(ProgressBar.path);
  I.waitForText(content.en.title);
}

function seeContentForNotDefending() {
  const I = this;

  I.see(content.en.notDefending.heading);
  I.see(content.en.notDefending.info);
}


function seeContentForDefendingAwaitingAnswer() {
  const I = this;

  I.see(content.en.defendingAwaitingAnswer.heading);
}


function seeContentForNotDefendingSubmittedAnswer() {
  const I = this;

  I.see(content.en.defendingSubmittedAnswer.heading);
  I.see(content.en.defendingSubmittedAnswer.para1);
}


function seeContentForTooLateToRespond() {
  const I = this;

  I.see(content.en.tooLateToRespond.heading);
  I.see(content.en.tooLateToRespond.info);
}

function seePetitionToDownload() {
  const I = this;
  I.see(content.en.files.dpetition);
}

function seeRespondentAnswersToDownload() {
  const I = this;
  I.see(content.en.files.respondentAnswers);
}

module.exports = {
  seeCrProgressBarPage,
  seeContentForNotDefending,
  seeContentForDefendingAwaitingAnswer,
  seeContentForNotDefendingSubmittedAnswer,
  seeContentForTooLateToRespond,
  seePetitionToDownload,
  seeRespondentAnswersToDownload
};
