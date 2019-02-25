const request = require('request-promise-native');
const CONF = require('config');
const logger = require('services/logger').getLogger(__filename);

const FORBIDDEN = 403;

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
      logger.errorWithReq(req, 'get_petitioner_error', 'Trying to connect to Case orchestration service error', error.message);
      throw error;
    });
};

const linkCase = req => {
  const caseId = req.body.referenceNumber.replace(/\D/gi, '');
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
      req.session.temp.linkCaseError = true;
      if (error.statusCode === FORBIDDEN) {
        req.session.temp.linkCaseAuthError = true;
      }
      logger.errorWithReq(req, 'link_case_error', 'Error linking petition to user', error);
      throw error;
    });
};

const sendAosResponse = (req, body) => {
  const referenceNumber = req.session.referenceNumber;
  const uri = `${CONF.services.caseOrchestration.submitAosUrl}/${referenceNumber}`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `${req.cookies[authTokenString]}` };

  return request.post({ uri, body, headers, json: true })
    .catch(error => {
      logger.errorWithReq(req, 'send_response_error', 'Trying to connect to Case orchestration service error', error.message);
      throw error;
    });
};

module.exports = {
  getPetition,
  linkCase,
  sendAosResponse
};