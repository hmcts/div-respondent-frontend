/* eslint-disable operator-linebreak */
const { Interstitial } = require('@hmcts/one-per-page/steps');
const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const constants = require('common/constants');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');

const caseStateMap = [
  {
    template: './sections/OneCircleFilledIn.html',
    state: [constants.caseStates.AwaitingReissue]
  },
  {
    template: './sections/OneCircleFilledInBold.html',
    state: [constants.caseStates.AosAwaiting, constants.caseStates.AosStarted, constants.caseStates.AosOverdue]
  },
  {
    template: './sections/TwoCircleFilledIn.html',
    state: [
      constants.caseStates.AosSubmittedAwaitingAnswer,
      constants.caseStates.DefendedDivorce,
      constants.caseStates.AwaitingLegalAdvisorReferral,
      constants.caseStates.AmendPetition,
      constants.caseStates.AwaitingConsideration,
      constants.caseStates.AwaitingClarification,
      constants.caseStates.AwaitingPronouncement,
      constants.caseStates.AosCompleted
    ]
  },
  {
    template: './sections/TwoCircleFilledInBold.html',
    state: [constants.caseStates.AwaitingDecreeNisi, constants.caseStates.DNAwaiting]
  },
  {
    template: './sections/ThreeCircleFilledInBold.html',
    state: [constants.caseStates.AwaitingDecreeAbsolute]
  },
  {
    template: './sections/FourCircleFilledIn.html',
    state: [constants.caseStates.DivorceGranted]
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
    return constants.respProgressStates;
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
    return this.caseBeyondAos(caseState) && this.session.originalPetition.respWillDefendDivorce === constants.userActions.yesOrNo.no;
  }

  awaitingAnswer(caseState) {
    return caseState === constants.caseStates.AosSubmittedAwaitingAnswer;
  }

  defendedDivorce(caseState) {
    return caseState === constants.caseStates.DefendedDivorce;
  }

  caseBeyondAos(caseState) {
    return (
      caseState === constants.caseStates.AwaitingLegalAdvisorReferral ||
      caseState === constants.caseStates.AmendPetition ||
      caseState === constants.caseStates.AwaitingClarification ||
      caseState === constants.caseStates.AwaitingConsideration ||
      caseState === constants.caseStates.AwaitingDecreeAbsolute ||
      caseState === constants.caseStates.DNAwaiting ||
      caseState === constants.caseStates.AwaitingReissue ||
      caseState === constants.caseStates.DivorceGranted ||
      caseState === constants.caseStates.AwaitingPronouncement
    );
  }

  get isDefending() {
    return this.session.originalPetition.respWillDefendDivorce === constants.userActions.yesOrNo.yes;
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
