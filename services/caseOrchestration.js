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
    headers
  };
  return request.get(options)
    .catch(error => {
      logger.error(`Trying to connect to Case orchestration service error: ${error}`);
      throw error;
    });
};

module.exports = { getPetition };