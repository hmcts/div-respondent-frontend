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

function seeContentForAwaitingPronouncement() {
  const I = this;

  I.see(content.en.decreeNisiAnnouncement.districtJudge);
  I.see(content.en.decreeNisiAnnouncement.secondStage);
}

module.exports = {
  seeProgressBarPage,
  seeContentForAosNotCompleted,
  seeContentForAosCompleteNotDefending,
  seeContentForAosCompleteAwaitingAnswer,
  seeContentForAosCompleteDefending,
  seeContentForAwaitingPronouncement
};
