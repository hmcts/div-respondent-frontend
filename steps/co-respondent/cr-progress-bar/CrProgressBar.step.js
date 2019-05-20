const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');

class CrProgressBar extends Interstitial {
  static get path() {
    return config.paths.coRespondent.progressBar;
  }

  get session() {
    return this.req.session;
  }

  receivedAosFromCoResp() {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.aos && this.session.originalPetition.coRespondentAnswers.aos.received === config.yesOrNo.yes;
  }

  coRespDefendsDivorce() {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.defendsDivorce === config.yesOrNo.yes;
  }

  receivedAnswerFromCoResp() {
    return this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.answer && this.session.originalPetition.coRespondentAnswers.answer.received === config.yesOrNo.yes;
  }

  get progressStates() {
    return config.coRespProgressStates;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    return createUris(this.session.originalPetition.d8 || [], docConfig);
  }

  getProgressBarContent() {
    if (this.receivedAosFromCoResp()) {
      if (!this.coRespDefendsDivorce()) {
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
