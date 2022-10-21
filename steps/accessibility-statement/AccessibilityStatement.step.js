const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { getWebchatOpeningHours } = require('middleware/getWebchatOpenHours');

class AccessibilityStatement extends Page {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }

  static get path() {
    return config.paths.accessibilityStatement;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = AccessibilityStatement;
