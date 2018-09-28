const { Question } = require('@hmcts/one-per-page/steps');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const caseOrchestration = require('services/caseOrchestration');
const Joi = require('joi');
const config = require('config');
const idam = require('services/idam');

const referenceNumberMinLength = 16;

class CaptureCaseAndPin extends Question {
  static get path() {
    return config.paths.captureCaseAndPin;
  }

  get form() {
    return form({
      referenceNumber: text
        .joi(
          this.content.errors.referenceNumberRequired,
          Joi.string()
            .min(referenceNumberMinLength)
            .required())
        .joi(
          this.content.errors.referenceNumberDigitsOnly,
          Joi.number()
            .integer()
        ),
      securityAccessCode: text.joi(
        this.content.errors.securityAccessCodeRequired,
        Joi.string()
          .required())
        .joi(
          this.content.errors.securityAccessCodeDigitsOnly,
          Joi.number()
            .integer()
        )
    });
  }

  next() {
    return action(caseOrchestration.linkCase)
      .then(goTo(this.journey.steps.Respond))
      .onFailure();
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = CaptureCaseAndPin;
