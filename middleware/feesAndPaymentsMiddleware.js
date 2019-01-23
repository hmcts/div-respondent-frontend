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
        logger.info(logger.wrapWithUserInfo(req, `Fee amount set to ${response.amount}`));
        res.locals.applicationFee[feeUrl] = response;
        return next();
      })
      .catch(error => {
        logger.error({
          message: logger.wrapWithUserInfo(req, 'An error occoured when retrieveing free from feesAndPaymentsService'),
          error
        });
        next(error);
      });
  };
};

module.exports = { getFeeFromFeesAndPayments };
