const request = require('request-promise-native');
const CONF = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const sendAosResponse = (req, body) => {
  if (['development', 'testing'].includes(CONF.environment)) {
    return new Promise(resolve => {
      resolve(true);
    });
  }

  const referenceNumber = req.session.referenceNumber;
  const uri = `${CONF.services.caseOrchestration.submitAosUrl}/${referenceNumber}`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `${req.cookies[authTokenString]}` };

  return request.post({ uri, body, headers, json: true })
    .catch(error => {
      logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
      throw error;
    });
};

module.exports = sendAosResponse;