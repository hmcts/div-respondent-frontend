const request = require('request-promise-native');
const CONF = require('config');
const logger = require('services/logger').getLogger(__filename);

const FORBIDDEN = 403;

const COS_BASE_URI = `${CONF.services.caseOrchestration.baseUrl}`;

const getPetition = req => {
  const uri = `${COS_BASE_URI}/retrieve-aos-case?checkCcd=true`;
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
  const uri = `${COS_BASE_URI}/link-respondent/${caseId}/${pin}`;
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

const sendCoRespondentResponse = (req, body) => {
  const uri = `${COS_BASE_URI}/submit-co-respondent-aos`;
  const authTokenString = '__auth-token';
  const headers = { Authorization: `${req.cookies[authTokenString]}` };

  return request.post({ uri, body, headers, json: true })
    .catch(error => {
      logger.errorWithReq(req, 'send_response_error', 'Trying to connect to Case orchestration service error', error.message);
      throw error;
    });
};

const sendAosResponse = (req, body) => {
  const referenceNumber = req.session.referenceNumber;
  const uri = `${COS_BASE_URI}/submit-aos/${referenceNumber}`;
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
  sendAosResponse,
  sendCoRespondentResponse
};
