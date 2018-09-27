const caseOrchestration = require('services/caseOrchestration');

const CaptureCaseAndPin = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');

const NOT_FOUND = 404;
const ERROR_RESPONSE = 400;

const captureCaseAndPin = (req, res, next) => {
  return caseOrchestration.getPetition(req)
    .then(response => {
      if (response.statusCode === NOT_FOUND) {
        return res.redirect(CaptureCaseAndPin.path);
      } else if (response.statusCode >= ERROR_RESPONSE) {
        return next(new Error(`Unexpected response code ${response.statusCode}`));
      }
      return next();
    });
};

module.exports = { captureCaseAndPin };
