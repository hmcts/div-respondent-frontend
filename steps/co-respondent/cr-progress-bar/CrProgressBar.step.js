const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');
const { get, last } = require('lodash');
const moment = require('moment');

const values = {
  yes: 'Yes',
  no: 'No'
};

const progressStates = {
  notDefending: 'notDefending',
  defendingAwaitingAnswer: 'defendingAwaitingAnswer',
  defendingSubmittedAnswer: 'defendingSubmittedAnswer',
  tooLateToRespond: 'tooLateToRespond',
  submittedResponseAndAllApproved: 'submittedResponseAndAllApproved',
  awaitingPronouncementHearingDataFuture: 'awaitingPronouncementHearingDataFuture'
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

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    return createUris(this.session.originalPetition.d8 || [], docConfig);
  }

  get entitlementToADecreeFileLink() {
    return this.downloadableFiles.find(file => {
      return file.type === 'certificateOfEntitlement';
    });
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get coRespondentPaysCosts() {
    const costOrder = get(this.session, 'originalPetition.costsClaimGranted');

    if (costOrder === 'Yes') {
      const whoPays = get(this.session, 'originalPetition.whoPaysCosts');
      return ['co-respondent', 'respondent and correspondent'].includes(whoPays);
    }

    return false;
  }

  awaitingPronouncementAndHearingDataInFuture() {
    const caseStateIsAwaitingPronouncement = this.session.caseState === config.caseStates.AwaitingPronouncement;

    if (caseStateIsAwaitingPronouncement) {
      const hearingDates = get(this.session, 'originalPetition.hearingDate');

      if (hearingDates && hearingDates.length) {
        const hearingDateInFuture = moment(last(hearingDates)).isAfter(moment());
        return hearingDateInFuture;
      }
    }

    return false;
  }

  getProgressBarContent() {
    if (this.receivedAosFromCoResp()) {
      if (this.awaitingPronouncementAndHearingDataInFuture()) {
        return this.progressStates.awaitingPronouncementHearingDataFuture;
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
