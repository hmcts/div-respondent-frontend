const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestration = require('services/caseOrchestration');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const content = require('./CheckYourAnswers.content');
const { parseBool } = require('@hmcts/one-per-page');

const yesValue = 'Yes';

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
    if (this.req.session.SolicitorRepresentation && this.req.session.SolicitorRepresentation.response === 'yes') {
      return form({
        respSolicitorRepStatement: text.joi(
          this.errorMessage,
          Joi.required().valid(yesValue)
        )
      });
    }
    return form({
      respStatementOfTruth: text.joi(
        this.errorMessage,
        Joi.required().valid(yesValue)
      )
    });
  }

  get errorMessage() {
    return content.en.errors.required;
  }

  get isRespondentSolEnabled() {
    return parseBool(config.features.respSolicitorDetails);
  }

  get isRepresentedBySol() {
    return this.req.session.SolicitorRepresentation && this.req.session.SolicitorRepresentation.response === 'yes';
  }

  sendToAPI(req) {
    const respondentAnswers = this.journey.values;
    if (this.isRepresentedBySol && this.isRespondentSolEnabled) {
      respondentAnswers.contactMethodIsDigital = 'No';
      respondentAnswers.consentToReceivingEmails = 'No';
      respondentAnswers.respStatementOfTruth = 'No';
    }
    return caseOrchestration.sendAosResponse(req, respondentAnswers);
  }

  next() {
    return action(this.sendToAPI)
      .then(goTo(this.journey.steps.Done))
      .onFailure();
  }
}

module.exports = CheckYourAnswers;
