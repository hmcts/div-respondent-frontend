const config = require('config');
const idam = require('services/idam');
const { initDocumentHandler } = require('@hmcts/div-document-express-handler');

const downloadDocumentEndpoint = '/documents';

const bind = app => {
  const middleware = [ idam.protect() ];
  const options = {
    documentServiceUrl: `${config.services.evidenceManagement.baseUrl}${downloadDocumentEndpoint}`,
    sessionFileCollectionsPaths: ['originalPetition.D8DocumentsGenerated']
  };
  initDocumentHandler(app, middleware, options);
};

module.exports = { bind };
