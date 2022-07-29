const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class PrivacyPolicy extends Page {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }
  static get path() {
    return config.paths.privacyPolicy;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = PrivacyPolicy;
