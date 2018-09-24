const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const config = require('config');
const idam = require('services/idam');

class RespondWithPin extends Question {
  static get path() {
    return config.paths.respondWithPin;
  }

  get form() {
    return form({
      referenceNumber: text,
      securityAccessCode: text
    });
  }

  next() {
    return goTo(this.journey.steps.Respond);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = RespondWithPin;
