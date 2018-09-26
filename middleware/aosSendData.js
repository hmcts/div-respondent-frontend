const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const sendAosResponse = require('services/sendAosResponse');

const aosSendData = (req, res, next) => {
  const jsonContent = req.session.originalPetition.marriageRespondentName;

  sendAosResponse(req, jsonContent).then(response => {  // eslint-disable-line
    next();
  })
    .catch(error => {
      logger.error(`Unable to send AOS data: ${error}`);
      throw error;
    });
};

module.exports = aosSendData;