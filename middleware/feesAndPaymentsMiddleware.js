const feesAndPaymentsService = require('services/feesAndPaymentsService');
const logger = require('services/logger').getLogger(__filename);


const getFeeFromFeesAndPayments = feeUrl => {
  return (req, res, next) => {
    if (!res.locals.applicationFee) {
      res.locals.applicationFee = {};
    }
    return feesAndPaymentsService.get(feeUrl)
      .then(response => {
        // set fee returned from Fees and payments service
        res.locals.applicationFee[feeUrl] = response;
        logger.infoWithReq(req, 'fees_set', 'Fee amount set to', response.amount);
        return next();
      })
      .catch(error => {
        logger.errorWithReq(req, 'fees_error', 'Error getting fees', feeUrl, error.message);
        next(error);
      });
  };
};

module.exports = { getFeeFromFeesAndPayments };
