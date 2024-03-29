/* eslint-disable operator-linebreak */
const { Interstitial } = require('@hmcts/one-per-page/steps');
const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');
const { get } = require('lodash');
const { progressStates, values, caseStateMap, caseStatesBeyondAos } = require('./ProgressBar.config');
const commonContent = require('common/content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.respondent.progressBar;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
  }

  get progressStates() {
    return progressStates;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    return createUris(this.session.originalPetition.d8 || [], docConfig);
  }

  get certificateOfEntitlementFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'certificateOfEntitlement';
    });
  }

  awaitingPronouncement(caseState) {
    const isAwaitingPronouncement = caseState === config.caseStates.AwaitingPronouncement;
    const hearingDate = get(this.session, 'originalPetition.hearingDate') || [];

    return isAwaitingPronouncement && hearingDate.length;
  }

  get respondentPaysCosts() {
    const costOrder = get(this.session, 'originalPetition.costsClaimGranted');
    if (costOrder === 'Yes') {
      const whoPays = get(this.session, 'originalPetition.whoPaysCosts');
      return ['respondent', 'respondentAndCoRespondent'].includes(whoPays);
    }

    return false;
  }

  get costsOrderFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'costsOrder';
    });
  }

  get decreeNisiFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'decreeNisi';
    });
  }

  getProgressBarContent() {
    const caseState = this.session.caseState;

    if (this.awaitingPronouncement(caseState)) {
      return this.progressStates.awaitingPronouncement;
    } else if (this.awaitingDecreeAbsolute(caseState)) {
      return this.progressStates.awaitingDecreeAbsolute;
    } else if (this.dnPronounced(caseState)) {
      return this.progressStates.dnPronounced;
    } else if (this.progressedNoAos(caseState)) {
      return this.progressStates.progressedNoAos;
    } else if (this.progressedUndefended(caseState)) {
      return this.progressStates.progressedUndefended;
    } else if (this.awaitingAnswer(caseState)) {
      return this.progressStates.awaitingAnswer;
    } else if (this.defendedDivorce(caseState)) {
      return this.progressStates.defendedDivorce;
    } else if (this.aosAwaitingSol(caseState)) {
      return this.progressStates.aosAwaitingSol;
    }

    logger.warnWithReq(this.req, 'progress_bar_content', 'No valid case state for ProgressBar page', caseState);
    return this.progressStates.other;
  }

  progressedNoAos(caseState) {
    return this.caseBeyondAos(caseState) && !this.session.originalPetition.respWillDefendDivorce;
  }

  progressedUndefended(caseState) {
    return this.caseBeyondAos(caseState) && this.session.originalPetition.respWillDefendDivorce === values.no;
  }

  awaitingDecreeAbsolute(caseState) {
    const decreeNisiGrantedDate = get(this.session, 'originalPetition.decreeNisiGrantedDate');
    return caseState === config.caseStates.AwaitingDecreeAbsolute && decreeNisiGrantedDate;
  }

  dnPronounced(caseState) {
    return caseState === config.caseStates.DNPronounced;
  }

  awaitingAnswer(caseState) {
    return caseState === config.caseStates.AosSubmittedAwaitingAnswer;
  }

  defendedDivorce(caseState) {
    return caseState === config.caseStates.DefendedDivorce;
  }

  aosAwaitingSol(caseState) {
    return caseState === config.caseStates.AosAwaitingSol;
  }

  caseBeyondAos(caseState) {
    return caseStatesBeyondAos.includes(caseState);
  }

  get isDefending() {
    return this.session.originalPetition.respWillDefendDivorce === values.yes;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  get currentCaseState() {
    return this.req.session.caseState;
  }
  // Select the corresponding template depending on case states
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
