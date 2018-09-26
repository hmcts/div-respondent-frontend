const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const middleware = require('middleware/authenticated');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    return redirectTo(this.journey.steps.CaptureCaseAndPin);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.landingPage(),
      middleware.captureCaseAndPin
    ];
  }
}

module.exports = Authenticated;
