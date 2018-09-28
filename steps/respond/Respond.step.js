const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const authenticated = require('middleware/authenticated');
const loadMiniPetition = require('middleware/loadMiniPetition');

class Respond extends Interstitial {
  static get path() {
    return config.paths.respond;
  }

  get session() {
    return this.req.session;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  next() {
    return goTo(this.journey.steps.ReviewApplication);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      authenticated.captureCaseAndPin,
      loadMiniPetition.loadMiniPetition
    ];
  }
}

module.exports = Respond;
