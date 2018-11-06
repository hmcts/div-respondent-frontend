const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const preserveSession = require('middleware/preserveSession');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

class Done extends ExitPoint {
  static get path() {
    return config.paths.done;
  }
  get session() {
    return this.req.sess;
  }

  get feesAmendDivorce() {
    return this.res.locals.applicationFee['amend-fee'].amount;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee.DefendDivorcePayService.amount;
  }

  get middleware() {
    return [
      idam.protect(),
      getFeeFromFeesAndPayments('amend-fee'),
      getFeeFromFeesAndPayments('defended-petition-fee'),
      preserveSession,
      ...super.middleware,
      idam.logout()
    ];
  }
}

module.exports = Done;
