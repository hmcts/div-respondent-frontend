const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');

class Start extends Page {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }
  static get path() {
    return config.paths.index;
  }
  get middleware() {
    return [...super.middleware, idam.setRedirectUri];
  }
}

module.exports = Start;
