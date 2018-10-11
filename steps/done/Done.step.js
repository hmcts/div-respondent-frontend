const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const preserveSession = require('middleware/preserveSession');

class Done extends ExitPoint {
  static get path() {
    return config.paths.done;
  }
  get session() {
    return this.req.sess;
  }

  get middleware() {
    return [
      idam.protect(),
      preserveSession,
      ...super.middleware,
      idam.logout()
    ];
  }
}

module.exports = Done;
