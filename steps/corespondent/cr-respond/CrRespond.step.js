const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

class CrRespond extends Interstitial {
  static get path() {
    return config.paths.corespondent.respond;
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

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee')
    ];
  }
}

module.exports = CrRespond;
