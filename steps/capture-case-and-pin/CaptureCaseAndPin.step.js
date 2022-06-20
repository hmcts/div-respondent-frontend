const { Question } = require('@hmcts/one-per-page/steps');
const { goTo, action, stop } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const caseOrchestration = require('services/caseOrchestration');
const Joi = require('joi');
const config = require('config');
const idam = require('services/idam');
const { getWebchatOpeningHours } = require('middleware/getWebchatOpenHours');

const referenceNumberLength = 16;
const securityAccessCode = 8;

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
          .length(referenceNumberLength)
          .required());
  }

  buildSecurityAccessCodeValidation() {
    const errors = this.content.errors;
    return text.joi(
      errors.securityAccessCodeRequired,
      Joi.string()
        .length(securityAccessCode)
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
      getWebchatOpeningHours,
      idam.protect()
    ];
  }
}

module.exports = CaptureCaseAndPin;
