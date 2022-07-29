const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const petitionMiddleware = require('middleware/petitionMiddleware');
const redirectMiddleware = require('middleware/redirectMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const { documentWhiteList } = require('services/documentHandler');
const commonContent = require('common/content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

class Respond extends Interstitial {
  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: documentWhiteList(this.req)
    };
    return createUris(this.session.originalPetition.d8 || [], docConfig);
  }

  static get path() {
    return config.paths.respondent.respond;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  next() {
    return goTo(this.journey.steps.ReviewApplication);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect(),
      petitionMiddleware.loadMiniPetition,
      redirectMiddleware.redirectOnCondition
    ];
  }
}

module.exports = Respond;
