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

function seeRespAnswersToDownload() {
  const I = this;
  I.see(content.en.files.respondentAnswers);
}

function seeCoRespAnswersToDownload() {
  const I = this;
  I.see(content.en.files.coRespondentAnswers);
}

function seeCoRespCostsOrderToDownload() {
  const I = this;
  I.see(content.en.files.costsOrder);
}

function seeCoRespAwaitingPronouncementHearingDataFuture() {
  const I = this;

  I.see(content.en.awaitingPronouncementHearingDataFuture.title);
  I.see(content.en.awaitingPronouncementHearingDataFuture.districtJudge);
}

function seeCoRespDNPronouncedAndCosts() {
  const I = this;

  I.see(content.en.decreeNisiGranted.heading);
  I.see(content.en.decreeNisiGranted.decreeNisi);
}

function seeCoRespDNPronouncedWithoutCosts() {
  const I = this;

  I.see(content.en.notDefending.heading);
  I.see(content.en.notDefending.info);
}

module.exports = {
  seeCrProgressBarPage,
  seeContentForNotDefending,
  seeContentForDefendingAwaitingAnswer,
  seeContentForNotDefendingSubmittedAnswer,
  seeContentForTooLateToRespond,
  seePetitionToDownload,
  seeRespAnswersToDownload,
  seeCoRespAnswersToDownload,
  seeCoRespCostsOrderToDownload,
  seeCoRespAwaitingPronouncementHearingDataFuture,
  seeCoRespDNPronouncedAndCosts,
  seeCoRespDNPronouncedWithoutCosts
};
