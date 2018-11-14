const request = require('request-promise-native');
const CONF = require('config');

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const get = feeUrl => {
  const uri = `${CONF.services.feesAndPayments.baseUrl}${feeCodeEndpoint}${feeUrl}`;
  return request.get({ uri, json: true });
};

module.exports = { get };