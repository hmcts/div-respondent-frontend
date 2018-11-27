const { Page } = require('@hmcts/one-per-page');
const config = require('config');

class CookiesPolicy extends Page {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48', 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H39.3.NoCaption'];
  }
  static get path() {
    return config.paths.cookiesPolicy;
  }
  get middleware() {
    return [...super.middleware];
  }
}

module.exports = CookiesPolicy;