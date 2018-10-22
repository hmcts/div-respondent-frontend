const request = require('request-promise-native');
const CONF = require('config');

const feeCodeEndpoint = '/fees-and-payments/version/1/fee?request=';

const get = feeRequest => {
  const uri = `${CONF.services.feesAndPayments.baseUrl}${feeCodeEndpoint}${feeRequest}`;
  return request.get({ uri, json: true });
};

module.exports = { get };