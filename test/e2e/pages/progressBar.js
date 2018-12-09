const ProgressBar = require('steps/progress-bar/ProgressBar.step');
const content = require('steps/progress-bar/ProgressBar.content');

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

module.exports = {
  seeProgressBarPage,
  seeContentForAosNotCompleted,
  seeContentForAosCompleteNotDefending,
  seeContentForAosCompleteAwaitingAnswer,
  seeContentForAosCompleteDefending
};
