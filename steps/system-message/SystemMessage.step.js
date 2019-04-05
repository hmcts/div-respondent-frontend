const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { redirectTo } = require('@hmcts/one-per-page/flow');

class SystemMessage extends Interstitial {
  static get path() {
    return config.paths.systemMessage;
  }

  next() {
    return redirectTo(this.journey.steps.Respond);
  }
}

module.exports = SystemMessage;
