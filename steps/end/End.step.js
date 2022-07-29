const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class End extends ExitPoint {
  static get path() {
    return config.paths.end;
  }

  get middleware() {
    return [
      idam.protect(),
      ...super.middleware,
      getWebchatOpeningHours,
      idam.logout()
    ];
  }
}

module.exports = End;
