const feesAndPaymentsService = require('services/feesAndPaymentsService');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);


const getFeeFromFeesAndPayments = feeRequest => {
  return (req, res, next) => {
    if (!res.locals.applicationFee) {
      res.locals.applicationFee = {};
    }
    return feesAndPaymentsService.get(feeRequest)
      .then(response => {
        // set fee returned from Fees and payments service
        logger.info(' Fee amount set to ', response.amount);
        res.locals.applicationFee[feeRequest] = response;
        return next();
      })
      .catch(error => {
        logger.error(error);
        next(error);
      });
  };
};

module.exports = { getFeeFromFeesAndPayments };