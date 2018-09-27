const caseOrchestration = require('services/caseOrchestration');

const linkCaseOnSubmit = (req, res, next) => {
  if (req.method === 'POST') {
    return caseOrchestration.linkCase(req)
      .then(next, reason => {
        next(reason);
      });
  }
  return next();
};

module.exports = { linkCaseOnSubmit };
