const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');

class CrDone extends ExitPoint {
  static get path() {
    return config.paths.coRespondent.done;
  }

  get session() {
    return this.req.session;
  }

  get coRespEmailAddress() {
    if (this.session.originalPetition && this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.contactInfo) {
      return this.session.originalPetition.coRespondentAnswers.contactInfo.emailAddress;
    }
    return '';
  }

  get middleware() {
    return [
      idam.protect(),
      ...super.middleware,
      idam.logout()
    ];
  }
}

module.exports = CrDone;
