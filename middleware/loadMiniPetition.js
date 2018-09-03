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
      req.session.divorceCenterEmail = req.session.originalPetition.court[divorceCenter].email;
      req.session.divorceCenterPhone = req.session.originalPetition.court[divorceCenter].phoneNumber;
      req.session.divorceCenterOpenTimes = req.session.originalPetition.court[divorceCenter].openingHours;
      req.session.divorceCenterUrl = 'https://courttribunalfinder.service.gov.uk/courts/east-midlands-divorce-unit';
      /* eslint-enable */
      next();
    })
    .catch(error => {
      logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
      next();
    });
};

module.exports = loadMiniPetition;