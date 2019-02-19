const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');

class CrDone extends ExitPoint {
  static get path() {
    return config.paths.correspondent.done;
  }

  get session() {
    return this.req.session;
  }

  get caseData() {
    return this.req.session.originalPetition;
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
