const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    const nextStep = parseBool(config.features.showSystemMessage) ? this.journey.steps.SystemMessage : this.journey.steps.Respond;
    return redirectTo(nextStep);
  }

  get middleware() {
    return [...super.middleware, idam.landingPage];
  }
}

module.exports = Authenticated;
