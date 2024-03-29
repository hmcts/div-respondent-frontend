const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const commonContent = require('common/content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

class Done extends ExitPoint {
  static get path() {
    return config.paths.respondent.done;
  }
  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
  }

  get feesAmendDivorce() {
    return this.res.locals.applicationFee['amend-fee'].amount;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get middleware() {
    return [
      idam.protect(),
      getFeeFromFeesAndPayments('amend-fee'),
      getFeeFromFeesAndPayments('defended-petition-fee'),
      ...super.middleware,
      getWebchatOpeningHours,
      idam.logout()
    ];
  }
}

module.exports = Done;
