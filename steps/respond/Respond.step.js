const { Interstitial } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const petitionMiddleware = require('middleware/petitionMiddleware');
const redirectMiddleware = require('middleware/redirectMiddleware');

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
    return redirectTo(this.journey.steps.ReviewApplication);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      petitionMiddleware.loadMiniPetition,
      redirectMiddleware.redirectOnCondition
    ];
  }
}

module.exports = Respond;
