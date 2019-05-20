const { Question } = require('@hmcts/one-per-page/steps');
const { goTo, action, stop } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const caseOrchestration = require('services/caseOrchestration');
const Joi = require('joi');
const config = require('config');
const idam = require('services/idam');

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
          .replace(/\D/gi, '')
          .length(config.captureCaseAndPin.referenceNumberLength)
          .required());
  }

  buildSecurityAccessCodeValidation() {
    const errors = this.content.errors;
    return text.joi(
      errors.securityAccessCodeRequired,
      Joi.string()
        .length(config.captureCaseAndPin.securityAccessCodeLength)
        .required())
      .joi(
        errors.securityAccessCodeAlphanumericOnly,
        Joi.string()
          .regex(/^[a-zA-Z0-9]+$/));
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