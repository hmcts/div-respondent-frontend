const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { getUserData } = require('middleware/ccd');
const idam = require('services/idam');
const config = require('config');

class CheckYourAnswers extends CYA {
  static get path() {
    return config.paths.checkYourAnswers;
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }

  next() {
    return goTo(this.journey.steps.End);
  }
}

module.exports = CheckYourAnswers;
