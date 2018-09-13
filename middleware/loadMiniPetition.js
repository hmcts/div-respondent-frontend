const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const getCcdData = require('services/getCcdData');
const getCcdDataMock = require('mocks/services/getCcdDataMock');
const config = require('config');

let service = getCcdData;
if (['development', 'testing'].includes(config.environment)) {
  service = getCcdDataMock;
}


const loadMiniPetition = (req, res, next) => {
  service(req)
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
      logger.error(`Unable to load minipetition: ${error}`);
      next(error);
    });
};


module.exports = loadMiniPetition;