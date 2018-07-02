const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

class Protected extends Interstitial {
  static get path() {
    return config.paths.protected;
  }

  next() {
    return goTo(this.journey.steps.End);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = Protected;
