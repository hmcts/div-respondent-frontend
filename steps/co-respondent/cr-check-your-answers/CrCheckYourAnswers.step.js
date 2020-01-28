const SetLanguageQuestion = require('core/SetLanguageQuestion');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestration = require('services/caseOrchestration');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const content = require('./CrCheckYourAnswers.content');

class CrCheckYourAnswers extends SetLanguageQuestion {
  static get path() {
    return config.paths.coRespondent.checkYourAnswers;
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
      statementOfTruth: text.joi(
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
    const coRespAnswer = {};

    coRespAnswer.coRespondentAnswers = json;

    return caseOrchestration.sendCoRespondentResponse(req, coRespAnswer);
  }

  next() {
    return action(this.sendToAPI)
      .then(goTo(this.journey.steps.CrDone))
      .onFailure();
  }
}

module.exports = CrCheckYourAnswers;
