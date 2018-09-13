const request = require('request-promise-native');
const CONF = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const getCcdData = req => {
  const uri = `${CONF.services.caseOrchestration.getPetitionUrl}?checkCcd=true`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

  return request.get({ uri, headers, json: true })
    .catch(error => {
      logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
    });
};

module.exports = getCcdData;