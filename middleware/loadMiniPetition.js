const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const getCcdData = require('services/getCcdData');

const loadMiniPetition = (req, res, next) => {
  getCcdData(req)
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