const getfeesAndPaymentsService = require('services/feesAndPaymentsService');
const feesAndPaymentsServiceMock = require('mocks/feesAndPaymentsServiceMock');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const CONF = require('config');

let feesAndPaymentsService = {};

if (['development', 'testing'].includes(CONF.environment)) {
  feesAndPaymentsService = feesAndPaymentsServiceMock;
} else {
  feesAndPaymentsService = getfeesAndPaymentsService;
}


const getFeeFromFeesAndPayments = feeUrl => {
  return (req, res, next) => {
    if (!res.locals.applicationFee) {
      res.locals.applicationFee = {};
    }
    return feesAndPaymentsService.get(feeUrl)
      .then(response => {
        // set fee returned from Fees and payments service
        logger.info(' Fee amount set to ', response.amount);
        res.locals.applicationFee[feeUrl] = response;
        return next();
      })
      .catch(error => {
        logger.error(error);
        next(error);
      });
  };
};

module.exports = { getFeeFromFeesAndPayments };