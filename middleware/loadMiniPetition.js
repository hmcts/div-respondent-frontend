const request = require('request-promise-native');
const CONF = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const loadMiniPetition = (req, res, next) => {
  const uri = `${CONF.services.caseOrchestration.getPetitionUrl}?checkCcd=true`;
  //  const authTokenString = '__auth-token';
  const headers = { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJsaGJwY2k1YXU5YjlucDc2NTkwcTlmODFvZSIsInN1YiI6IjE0MzY3OCIsImlhdCI6MTUzNjMwNTk1NiwiZXhwIjoxNTM2MzM0NzU2LCJkYXRhIjoiY2l0aXplbixwcm9iYXRlLXByaXZhdGUtYmV0YSxjaXRpemVuLWxvYTEscHJvYmF0ZS1wcml2YXRlLWJldGEtbG9hMSIsInR5cGUiOiJBQ0NFU1MiLCJpZCI6IjE0MzY3OCIsImZvcmVuYW1lIjoic2ltdWxhdGUtZGVsaXZlcmVkN2UzYWYwYTQtZjM5MS00OWE4LTkzZjUtMTQxOTVhNzdmY2IwIiwic3VybmFtZSI6IlVzZXIiLCJkZWZhdWx0LXNlcnZpY2UiOiJQcm9iYXRlIiwibG9hIjoxLCJkZWZhdWx0LXVybCI6Imh0dHBzOi8vd3d3LnByZXByb2QucHJvYmF0ZS5yZWZvcm0uaG1jdHMubmV0IiwiZ3JvdXAiOiJwcm9iYXRlLXByaXZhdGUtYmV0YSJ9.-wS0qK6L3pk30JklQ3MB6KHykJj1qLbhTSOfPs1yNsM' };

  request.get({ uri, headers, json: true })
    .then(response => {
      req.session.referenceNumber = response.caseId;
      req.session.originalPetition = response.data;
      /* eslint-disable */
      if (req.session.originalPetition.marriageIsSameSexCouple !== 'Yes') {
        req.session.divorceWho = req.session.originalPetition.divorceWho === 'husband'
              ? 'wife'
              : 'husband';
      } else {
        req.session.divorceWho =  req.session.originalPetition.divorceWho;
      }

      const divorceCenter = req.session.originalPetition.courts;
      req.session.divorceCenterName = req.session.originalPetition.court[divorceCenter].divorceCentre;
      /* eslint-enable */
      next();
    })
    .catch(error => {
      logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
      next();
    });
};

module.exports = loadMiniPetition;