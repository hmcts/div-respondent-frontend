const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');

//  WIP
class CrDone extends ExitPoint {
  static get path() {
    return config.paths.coRespondent.done;
  }

  get session() {
    return this.req.session;
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
