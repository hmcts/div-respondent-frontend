const request = require('request-promise-native');
const CONF = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const loadMiniPetition = (req, res, next) => {
  const uri = `${CONF.services.caseOrchestration.getPetitionUrl}?checkCcd=true`;
  //  const authTokenString = '__auth-token';
  const headers = { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxam91YThvcWphYWs2bHBnbnNpNmhvczVuayIsInN1YiI6Ijg0MTMzIiwiaWF0IjoxNTM2NTgwMDU4LCJleHAiOjE1MzY2MDg4NTgsImRhdGEiOiJjaXRpemVuLGNsYWltYW50LGxldHRlci1ob2xkZXIsbGV0dGVyLTEyNjc1NyxkZWZlbmRhbnQsY21jLXByaXZhdGUtYmV0YSxsZXR0ZXItaG9sZGVyLGxldHRlci0xMzU2NjgsbGV0dGVyLWhvbGRlcixsZXR0ZXItMTQwOTY4LGNpdGl6ZW4tbG9hMSxjbGFpbWFudC1sb2ExLGxldHRlci1ob2xkZXItbG9hMSxsZXR0ZXItMTI2NzU3LWxvYTEsZGVmZW5kYW50LWxvYTEsY21jLXByaXZhdGUtYmV0YS1sb2ExLGxldHRlci1ob2xkZXItbG9hMSxsZXR0ZXItMTM1NjY4LWxvYTEsbGV0dGVyLWhvbGRlci1sb2ExLGxldHRlci0xNDA5NjgtbG9hMSIsInR5cGUiOiJBQ0NFU1MiLCJpZCI6Ijg0MTMzIiwiZm9yZW5hbWUiOiJNYXRoYW4iLCJzdXJuYW1lIjoiVGhhdmEiLCJkZWZhdWx0LXNlcnZpY2UiOiJjbWMiLCJsb2EiOjEsImRlZmF1bHQtdXJsIjoiaHR0cHM6Ly93d3cubW9uZXljbGFpbXMuZGVtby5wbGF0Zm9ybS5obWN0cy5uZXQvcmVjZWl2ZXIiLCJncm91cCI6ImNpdGl6ZW5zIn0.ASRzS_ajYzymNdSWiR9QJmNUEdnry1BkzK2hT0On5lE' };

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