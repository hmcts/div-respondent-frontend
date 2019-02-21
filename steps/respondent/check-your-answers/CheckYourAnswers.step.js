const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestration = require('services/caseOrchestration');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const content = require('./CheckYourAnswers.content');

class CheckYourAnswers extends CYA {
  static get path() {
    return config.paths.respondent.checkYourAnswers;
  }

  constructor(...args) {
    super(...args);
    this.sendToAPI = this.sendToAPI.bind(this);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  get form() {
    return form({
      respStatementOfTruth: text.joi(
        this.errorMessage,
        Joi.required().valid('Yes')
      )
    });
  }

  get errorMessage() {
    return content.en.errors.required;
  }

  sendToAPI(req) {
    const json = this.journey.values;
    return caseOrchestration.sendAosResponse(req, json);
  }

  next() {
    return action(this.sendToAPI)
      .then(goTo(this.journey.steps.Done))
      .onFailure();
  }
}

module.exports = CheckYourAnswers;
