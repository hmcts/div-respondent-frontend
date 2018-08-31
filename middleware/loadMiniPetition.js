const request = require('request-promise-native');
const CONF = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const loadMiniPetition = (req, res, next) => {
  const uri = CONF.services.caseOrchestration.getPetitionUrl;
  const headers = {
    Authorization: 'asdasdas',
    'Content-Type': 'application/json'
  };

  request.get({ uri, headers, json: true })
    .then(response => {
      req.session.getminipetiion = response;
      next();
    })
    .catch(error => {
      logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
      next();
    });
};

module.exports = loadMiniPetition;