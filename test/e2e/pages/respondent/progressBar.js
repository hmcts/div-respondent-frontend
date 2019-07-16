const ProgressBar = require('steps/respondent/progress-bar/ProgressBar.step');
const content = require('steps/respondent/progress-bar/ProgressBar.content');

function seeProgressBarPage() {
  const I = this;

  I.seeCurrentUrlEquals(ProgressBar.path);
  I.waitForText(content.en.title);
}

function seeContentForAosNotCompleted() {
  const I = this;

  I.see(content.en.progressedNoAos.heading);
  I.see(content.en.progressedNoAos.info);
}

function seeContentForAosCompleteNotDefending() {
  const I = this;

  I.see(content.en.progressedUndefended.heading);
  I.see(content.en.progressedUndefended.info);
}

function seeContentForAosCompleteAwaitingAnswer() {
  const I = this;

  I.see(content.en.awaitingAnswer.heading);
}

function seeContentForAosCompleteDefending() {
  const I = this;

  I.see(content.en.defendedDivorce.heading);
  I.see(content.en.defendedDivorce.para1);
}

function seeContentForAwaitingDecreeAbsolute() {
  const I = this;

  I.see(content.en.decreeNisiGranted.notDivorcedYet);
  I.see(content.en.decreeNisiGranted.divorceComplete);
}

function seeContentForDARequested() {
  const I = this;

  I.see(content.en.decreeNisiGranted.notDivorcedYet);
  I.see(content.en.decreeNisiGranted.divorceComplete);
}

function seeContentForDNPronounced() {
  const I = this;

  I.see(content.en.decreeNisiGranted.notDivorcedYet);
  I.see(content.en.decreeNisiGranted.divorceComplete);
}

function seePetitionToDownload() {
  const I = this;
  I.see(content.en.files.dpetition);
}

function seeRespondentAnswersToDownload() {
  const I = this;
  I.see(content.en.files.respondentAnswers);
}

function seeCoRespondentAnswersToDownload() {
  const I = this;
  I.see(content.en.files.coRespondentAnswers);
}

function seeCostsOrderToDownload() {
  const I = this;
  I.see(content.en.files.costsOrder);
}

function seeDecreeNisiToDownload() {
  const I = this;
  I.see(content.en.files.decreeNisi);
}

module.exports = {
  seeProgressBarPage,
  seeContentForAosNotCompleted,
  seeContentForAosCompleteNotDefending,
  seeContentForAosCompleteAwaitingAnswer,
  seeContentForAosCompleteDefending,
  seePetitionToDownload,
  seeRespondentAnswersToDownload,
  seeCoRespondentAnswersToDownload,
  seeContentForAwaitingDecreeAbsolute,
  seeContentForDNPronounced,
  seeCostsOrderToDownload,
  seeDecreeNisiToDownload,
  seeContentForDARequested
};
