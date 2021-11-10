const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');

class CrRespond extends Interstitial {
  static get path() {
    return config.paths.coRespondent.respond;
  }

  get session() {
    return this.req.session;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  next() {
    return goTo(this.journey.steps.CrReviewApplication);
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    return createUris(this.session.originalPetition.d8 || [], docConfig);
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
