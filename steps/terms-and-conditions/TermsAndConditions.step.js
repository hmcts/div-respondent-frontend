const { Page } = require('@hmcts/one-per-page');
const config = require('config');

class TermsAndConditions extends Page {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }
  static get path() {
    return config.paths.termsAndConditions;
  }
  get middleware() {
    return [...super.middleware];
  }
}

module.exports = TermsAndConditions;