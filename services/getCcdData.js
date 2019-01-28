const request = require('request-promise-native');
const CONF = require('config');
const logger = require('services/logger').getLogger(__filename);

const getCcdData = req => {
  const uri = `${CONF.services.caseOrchestration.getPetitionUrl}?checkCcd=true`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

  return request.get({ uri, headers, json: true })
    .catch(error => {
      logger.error({
        message: logger.wrapWithUserInfo(req, 'Trying to connect to Case orchestration service error'),
        error
      });
      throw error;
    });
};

module.exports = getCcdData;
