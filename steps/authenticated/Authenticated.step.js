const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { getWebchatOpeningHours } = require('middleware/getWebchatOpenHours');
const idam = require('services/idam');
const config = require('config');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    return redirectTo(this.journey.steps.Respond);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.landingPage
    ];
  }
}

module.exports = Authenticated;
