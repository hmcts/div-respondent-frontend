const request = require('request-promise-native');
const CONF = require('config');

const get = feeUrl => {
  const uri = `${CONF.services.feesAndPayments.baseUrl}${CONF.services.feesAndPayments.feeCodeEndpoint}${feeUrl}`;
  return request.get({ uri, json: true });
};

module.exports = { get };