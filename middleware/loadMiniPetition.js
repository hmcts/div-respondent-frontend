const caseOrchestration = require('services/caseOrchestration');

const CaptureCaseAndPin = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const InvalidCaseState = require('steps/invalid-case-state/InvalidCaseState.step');

const AOS_STARTED = 'AosStarted';
const SUCCESS = 200;
const NOT_FOUND = 404;
const ERROR_RESPONSE = 400;

function storePetitionInSession(req, response) {
  req.session.referenceNumber = response.body.caseId;
  req.session.originalPetition = response.body.data;
  /* eslint-disable */
  if (req.session.originalPetition.marriageIsSameSexCouple !== 'Yes') {
    req.session.divorceWho = req.session.originalPetition.divorceWho === 'husband'
      ? 'wife'
      : 'husband';
  } else {
    req.session.divorceWho = req.session.originalPetition.divorceWho;
  }

  const divorceCenter = req.session.originalPetition.courts;
  req.session.divorceCenterName = req.session.originalPetition.court[divorceCenter].divorceCentre;
  /* eslint-enable */
}

const loadMiniPetition = (req, res, next) => {
  return caseOrchestration.getPetition(req)
    .then(response => {
      if (response.statusCode === SUCCESS) {
        const caseState = response.body.state;
        if (caseState !== AOS_STARTED) {
          return res.redirect(InvalidCaseState.path);
        }
      } else if (response.statusCode === NOT_FOUND) {
        return res.redirect(CaptureCaseAndPin.path);
      } else if (response.statusCode >= ERROR_RESPONSE) {
        return next(new Error(`Unexpected response code ${response.statusCode}`));
      }
      storePetitionInSession(req, response);
      return next();
    });
};

module.exports = { loadMiniPetition };