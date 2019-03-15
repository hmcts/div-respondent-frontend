const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const values = {
  yes: 'Yes',
  no: 'No'
};

const progressStates = {
  notDefending: 'notDefending',
  defendingAwaitingAnswer: 'defendingAwaitingAnswer',
  defendingSubmittedAnswer: 'defendingSubmittedAnswer',
  tooLateToRespond: 'tooLateToRespond'
};

class CrProgressBar extends Interstitial {
  static get path() {
    return config.paths.coRespondent.progressBar;
  }

  get session() {
    return this.req.session;
  }

  receivedAosFromCoResp(checkValue) {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.aos && this.session.originalPetition.coRespondentAnswers.aos.received === checkValue;
  }

  coRespDefendsDivorce(checkValue) {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.defendsDivorce === checkValue;
  }

  receivedAnswerFromCoResp(checkValue) {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.answer && this.session.originalPetition.coRespondentAnswers.answer.received === checkValue;
  }

  get progressStates() {
    return progressStates;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  getProgressBarContent() {
    if (this.receivedAosFromCoResp(values.yes)) {
      if (this.coRespDefendsDivorce(values.no)) {
        return this.progressStates.notDefending;
      } else if (this.coRespDefendsDivorce(values.yes) && this.receivedAnswerFromCoResp(values.no)) {
        return this.progressStates.defendingAwaitingAnswer;
      } else if (this.coRespDefendsDivorce(values.yes) && this.receivedAnswerFromCoResp(values.yes)) {
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
