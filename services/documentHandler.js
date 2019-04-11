const config = require('config');
const idam = require('services/idam');
const { initDocumentHandler } = require('@hmcts/div-document-express-handler');
const { get } = require('lodash');

const downloadDocumentEndpoint = '/documents';

const documentWhiteList = req => {
  const idamEmailAddress = get(req, 'idam.userDetails.email');
  const coRespondentEmailAddress = get(
    req,
    'session.originalPetition.coRespondentAnswers.contactInfo.emailAddress'
  );

  const isCorespondent = idamEmailAddress === coRespondentEmailAddress;

  // return files corespondent is able to view
  if (isCorespondent) {
    return config.filesWhiteList.coRespondent;
  }

  // return files respondent is able to view
  return config.filesWhiteList.respondent;
};

const bind = app => {
  const middleware = [ idam.protect() ];
  const options = {
    documentServiceUrl: `${config.services.evidenceManagement.baseUrl}${downloadDocumentEndpoint}`,
    sessionFileCollectionsPaths: ['originalPetition.D8DocumentsGenerated'],
    documentWhiteList
  };
  initDocumentHandler(app, middleware, options);
};

module.exports = { bind, documentWhiteList };
