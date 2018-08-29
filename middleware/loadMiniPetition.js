const request = require('request-promise-native');

const loadMiniPetition = (req, res, next) => {
  const uri = 'CONF.services.caseOrchestration.getPetitionUrl';
  const headers = {
    Authorization: 'asdasdas',
    'Content-Type': 'application/json'
  };

  request.get({ uri, headers, json: true })
    .then(response => {
      req.session.getminipetiion = response;
      next();
    })
    .catch(error => {
      console.log(error); // eslint-disable-line no-console
      next();
    });
};

module.exports = loadMiniPetition;