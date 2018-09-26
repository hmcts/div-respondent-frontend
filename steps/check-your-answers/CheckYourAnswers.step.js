const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const aosSendData = require('middleware/aosSendData');

class CheckYourAnswers extends CYA {
  static get path() {
    return config.paths.checkYourAnswers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  store() {
    super.store();
    aosSendData(this.req, this.res, this.next);
    return this;
  }

  next() {
    return goTo(this.journey.steps.End);
  }
}

module.exports = CheckYourAnswers;
