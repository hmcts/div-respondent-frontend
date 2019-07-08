const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');
const { get } = require('lodash');

const values = {
  yes: 'Yes',
  no: 'No'
};

const progressStates = {
  notDefending: 'notDefending',
  defendingAwaitingAnswer: 'defendingAwaitingAnswer',
  defendingSubmittedAnswer: 'defendingSubmittedAnswer',
  tooLateToRespond: 'tooLateToRespond',
  awaitingPronouncementHearingDate: 'awaitingPronouncementHearingDate',
  dnPronounced: 'dnPronounced'
};

const isCostsOrderFile = file => {
  return file.type === 'costsOrder';
};

class CrProgressBar extends Interstitial {
  static get path() {
    return config.paths.coRespondent.progressBar;
  }

  get session() {
    return this.req.session;
  }

  receivedAosFromCoResp() {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.aos && this.session.originalPetition.coRespondentAnswers.aos.received === values.yes;
  }

  coRespDefendsDivorce() {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.defendsDivorce === values.yes;
  }

  receivedAnswerFromCoResp() {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.answer && this.session.originalPetition.coRespondentAnswers.answer.received === values.yes;
  }

  get progressStates() {
    return progressStates;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    const uris = createUris(this.session.originalPetition.d8 || [], docConfig);

    if (!this.coRespondentPaysCosts) {
      return uris.filter(file => {
        return !isCostsOrderFile(file);
      });
    }

    return uris;
  }

  get costsOrderFile() {
    return this.downloadableFiles.find(isCostsOrderFile);
  }

  get certificateOfEntitlementFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'certificateOfEntitlement';
    });
  }

  get coRespondentPaysCosts() {
    const costOrder = get(this.session, 'originalPetition.costsClaimGranted');

    if (costOrder === 'Yes') {
      const whoPays = get(this.session, 'originalPetition.whoPaysCosts');
      return ['coRespondent', 'respondentAndCoRespondent'].includes(whoPays);
    }

    return false;
  }

  awaitingPronouncementAndHearingDate() {
    const caseStateIsAwaitingPronouncement = this.session.caseState === config.caseStates.AwaitingPronouncement;
    const hearingDates = get(this.session, 'originalPetition.hearingDate') || [];

    return caseStateIsAwaitingPronouncement && hearingDates.length;
  }

  dnPronouncedAndPaysCosts() {
    return this.coRespondentPaysCosts && this.session.caseState === config.caseStates.DNPronounced;
  }

  getProgressBarContent() {
    if (this.receivedAosFromCoResp()) {
      if (this.dnPronouncedAndPaysCosts()) {
        return this.progressStates.dnPronounced;
      } else if (this.awaitingPronouncementAndHearingDate()) {
        return this.progressStates.awaitingPronouncementHearingDate;
      } else if (!this.coRespDefendsDivorce()) {
        return this.progressStates.notDefending;
      } else if (this.coRespDefendsDivorce() && !this.receivedAnswerFromCoResp()) {
        return this.progressStates.defendingAwaitingAnswer;
      } else if (this.coRespDefendsDivorce() && this.receivedAnswerFromCoResp()) {
        return this.progressStates.defendingSubmittedAnswer;
      }
    }
    return this.progressStates.tooLateToRespond;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('defended-petition-fee')
    ];
  }
}

module.exports = CrProgressBar;
