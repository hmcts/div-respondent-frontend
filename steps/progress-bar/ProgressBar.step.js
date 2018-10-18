/* eslint-disable operator-linebreak */
const { Interstitial } = require('@hmcts/one-per-page/steps');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const config = require('config');
const idam = require('services/idam');
const { CaseStates } = require('const');

const progressStates = {
  progressedNoAos: 'progressedNoAos',
  progressedUndefended: 'progressedUndefended',
  awaitingAnswer: 'awaitingAnswer',
  defendedDivorce: 'defendedDivorce'
};

const values = {
  yes: 'yes',
  no: 'no'
};

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.progressBar;
  }

  get session() {
    return this.req.session;
  }

  get progressStates() {
    return progressStates;
  }

  getProgressBarContent() {
    const caseState = this.session.caseState;

    if (this.progressedNoAos(caseState)) {
      return this.progressStates.progressedNoAos;
    } else if (this.progressedUndefended(caseState)) {
      return this.progressStates.progressedUndefended;
    } else if (this.awaitingAnswer(caseState)) {
      return this.progressStates.awaitingAnswer;
    } else if (this.defendedDivorce(caseState)) {
      return this.progressStates.defendedDivorce;
    }

    return logger.error('No valid case state for ProgressBar page');
  }

  progressedNoAos(caseState) {
    return (
      caseState === CaseStates.AwaitingLegalAdvisorReferral ||
      caseState === CaseStates.AwaitingConsiderationDN ||
      caseState === CaseStates.AwaitingClarification ||
      caseState === CaseStates.AwaitingListing ||
      caseState === CaseStates.AwaitingPronouncement)
      && this.session.originalPetition.respDefendsDivorce === null;
  }

  progressedUndefended(caseState) {
    return (
      caseState === CaseStates.AosCompleted ||
      caseState === CaseStates.AwaitingLegalAdvisorReferral ||
      caseState === CaseStates.AwaitingConsiderationDN ||
      caseState === CaseStates.AwaitingClarification ||
      caseState === CaseStates.AwaitingListing ||
      caseState === CaseStates.AwaitingPronouncement)
      && this.session.originalPetition.respDefendsDivorce === values.no;
  }

  awaitingAnswer(caseState) {
    return (caseState === CaseStates.AwaitingAnswer) ||
      (caseState === CaseStates.AosCompleted && this.session.originalPetition.respDefendsDivorce === values.yes);
  }

  defendedDivorce(caseState) {
    return caseState === CaseStates.DefendedDivorce;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ProgressBar;
