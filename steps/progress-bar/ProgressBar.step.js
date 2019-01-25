/* eslint-disable operator-linebreak */
const { Interstitial } = require('@hmcts/one-per-page/steps');
const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const idam = require('services/idam');
const { CaseStates } = require('const');

const progressStates = {
  progressedNoAos: 'progressedNoAos',
  progressedUndefended: 'progressedUndefended',
  awaitingAnswer: 'awaitingAnswer',
  defendedDivorce: 'defendedDivorce',
  other: 'other'
};

const values = {
  yes: 'Yes',
  no: 'No'
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

    logger.error(this.req, 'progress_bar_content', 'No valid case state for ProgressBar page', caseState);
    return this.progressStates.other;
  }

  progressedNoAos(caseState) {
    return this.caseBeyondAos(caseState) && !this.session.originalPetition.respDefendsDivorce;
  }

  progressedUndefended(caseState) {
    return this.caseBeyondAos(caseState) && this.session.originalPetition.respDefendsDivorce === values.no;
  }

  awaitingAnswer(caseState) {
    return caseState === CaseStates.AosSubmittedAwaitingAnswer;
  }

  defendedDivorce(caseState) {
    return caseState === CaseStates.DefendedDivorce;
  }

  caseBeyondAos(caseState) {
    return (
      caseState === CaseStates.AwaitingLegalAdvisorReferral ||
      caseState === CaseStates.AmendPetition ||
      caseState === CaseStates.AwaitingClarification ||
      caseState === CaseStates.AwaitingConsideration ||
      caseState === CaseStates.AwaitingDecreeAbsolute ||
      caseState === CaseStates.DNAwaiting ||
      caseState === CaseStates.AwaitingReissue ||
      caseState === CaseStates.DivorceGranted ||
      caseState === CaseStates.AwaitingPronouncement
    );
  }

  get isDefending() {
    return this.session.originalPetition.respDefendsDivorce === values.yes;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ProgressBar;
