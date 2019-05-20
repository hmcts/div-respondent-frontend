/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
const { Interstitial } = require('@hmcts/one-per-page/steps');
const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');

const caseStateMap = [
  {
    template: './sections/OneCircleFilledIn.html',
    state: [config.caseStates.AwaitingReissue]
  },
  {
    template: './sections/OneCircleFilledInBold.html',
    state: [config.caseStates.AosAwaiting, config.caseStates.AosStarted, config.caseStates.AosOverdue]
  },
  {
    template: './sections/TwoCircleFilledIn.html',
    state: [config.caseStates.AosSubmittedAwaitingAnswer, config.caseStates.DefendedDivorce, config.caseStates.AwaitingLegalAdvisorReferral, config.caseStates.AmendPetition, config.caseStates.AwaitingConsideration, config.caseStates.AwaitingClarification, config.caseStates.AwaitingPronouncement, config.caseStates.AosCompleted]
  },
  {
    template: './sections/TwoCircleFilledInBold.html',
    state: [config.caseStates.AwaitingDecreeNisi, config.caseStates.DNAwaiting]
  },
  {
    template: './sections/ThreeCircleFilledInBold.html',
    state: [config.caseStates.AwaitingDecreeAbsolute]
  },
  {
    template: './sections/FourCircleFilledIn.html',
    state: [config.caseStates.DivorceGranted]
  }
];

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.respondent.progressBar;
  }

  get session() {
    return this.req.session;
  }

  get progressStates() {
    return config.respProgressStates;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    return createUris(this.session.originalPetition.d8 || [], docConfig);
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

    logger.errorWithReq(this.req, 'progress_bar_content', 'No valid case state for ProgressBar page', caseState);
    return this.progressStates.other;
  }

  progressedNoAos(caseState) {
    return this.caseBeyondAos(caseState) && !this.session.originalPetition.respWillDefendDivorce;
  }

  progressedUndefended(caseState) {
    return this.caseBeyondAos(caseState) && this.session.originalPetition.respWillDefendDivorce === config.yesOrNo.no;
  }

  awaitingAnswer(caseState) {
    return caseState === config.caseStates.AosSubmittedAwaitingAnswer;
  }

  defendedDivorce(caseState) {
    return caseState === config.caseStates.DefendedDivorce;
  }

  caseBeyondAos(caseState) {
    return (
      caseState === config.caseStates.AwaitingLegalAdvisorReferral ||
      caseState === config.caseStates.AmendPetition ||
      caseState === config.caseStates.AwaitingClarification ||
      caseState === config.caseStates.AwaitingConsideration ||
      caseState === config.caseStates.AwaitingDecreeAbsolute ||
      caseState === config.caseStates.DNAwaiting ||
      caseState === config.caseStates.AwaitingReissue ||
      caseState === config.caseStates.DivorceGranted ||
      caseState === config.caseStates.AwaitingPronouncement
    );
  }

  get isDefending() {
    return this.session.originalPetition.respWillDefendDivorce === config.yesOrNo.yes;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }

  get currentCaseState() {
    return this.req.session.caseState;
  }
  // Select the coresponding template depending on case states
  get stateTemplate() {
    let template = '';
    caseStateMap.forEach(dataMap => {
      if (dataMap.state.includes(this.currentCaseState)) {
        template = dataMap.template;
      }
    });
    if (template === '') {
      template = './sections/OneCircleFilledIn.html';
    }
    return template;
  }
}

module.exports = ProgressBar;
