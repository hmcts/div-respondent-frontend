const { Question } = require('@hmcts/one-per-page/steps');
const { goTo, action, stop } = require('@hmcts/one-per-page/flow');
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
      referenceNumber: this.buildReferenceNumberValidation(),
      securityAccessCode: this.buildSecurityAccessCodeValidation()
    });
  }

  buildReferenceNumberValidation() {
    const errors = this.content.errors;
    return text
      .joi(
        errors.referenceNumberRequired,
        Joi.string()
          .length(referenceNumberMinLength)
          .required())
      .joi(
        errors.referenceNumberDigitsOnly,
        Joi.number()
          .integer()
      );
  }

  buildSecurityAccessCodeValidation() {
    const errors = this.content.errors;
    return text.joi(
      errors.securityAccessCodeRequired,
      Joi.string()
        .required())
      .joi(
        errors.securityAccessCodeDigitsOnly,
        Joi.number()
          .integer()
      );
  }

  next() {
    return action(caseOrchestration.linkCase)
      .then(goTo(this.journey.steps.Respond))
      .onFailure(stop(this));
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = CaptureCaseAndPin;
