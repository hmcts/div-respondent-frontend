const request = require('request-promise-native');
const CONF = require('config');
const logger = require('@hmcts/nodejs-logging')
  .Logger
  .getLogger(__filename);

const getPetition = req => {
  const uri = `${CONF.services.caseOrchestration.getPetitionUrl}?checkCcd=true`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

  const options = {
    uri,
    headers,
    method: 'GET',
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };

  return request(options)
    .catch(error => {
      logger.error(`Trying to connect to Case orchestration service error: ${error}`);
      throw error;
    });
};

const linkCase = req => {
  const caseId = req.body.referenceNumber;
  const pin = req.body.securityAccessCode;
  const uri = `${CONF.services.caseOrchestration.linkRespondentUrl}/${caseId}/${pin}`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

  const options = {
    uri,
    headers
  };
  return request.post(options)
    .catch(error => {
      logger.error(`Error linking petition to user: ${error}`);
      throw error;
    });
};

module.exports = {
  getPetition,
  linkCase
};
