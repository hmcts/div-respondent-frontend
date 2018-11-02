const caseOrchestration = require('services/caseOrchestration');
const { CaseStates } = require('const');
const CaptureCaseAndPin = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const ProgressBar = require('steps/progress-bar/ProgressBar.step');

const SUCCESS = 200;
const NOT_FOUND = 404;
const ERROR_RESPONSE = 400;

function storePetitionInSession(req, response) {
  req.session.referenceNumber = response.body.caseId;
  req.session.caseState = response.body.state;
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
  req.session.divorceCenterCourtCity = req.session.originalPetition.court[divorceCenter].courtCity;
  req.session.divorceCenterPostCode = req.session.originalPetition.court[divorceCenter].postCode;

  if (req.session.originalPetition.court[divorceCenter].poBox) {
    req.session.divorceCenterPoBox = req.session.originalPetition.court[divorceCenter].poBox;
  }

  if (req.session.originalPetition.court[divorceCenter].street) {
    req.session.divorceCenterStreet = req.session.originalPetition.court[divorceCenter].street;
  }
  /* eslint-enable */
}

const loadMiniPetition = (req, res, next) => {
  return caseOrchestration.getPetition(req)
    .then(response => {
      if (response.statusCode === SUCCESS) {
        storePetitionInSession(req, response);
        const caseState = response.body.state;
        if (caseState !== CaseStates.AosStarted) {
          return res.redirect(ProgressBar.path);
        }
      } else if (response.statusCode === NOT_FOUND) {
        return res.redirect(CaptureCaseAndPin.path);
      } else if (response.statusCode >= ERROR_RESPONSE) {
        return next(new Error(`Unexpected response code while retrieving case: ${response.statusCode}`));
      }
      return next();
    });
};

module.exports = { loadMiniPetition };
