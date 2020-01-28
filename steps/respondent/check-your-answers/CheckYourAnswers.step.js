const SetLanguageQuestion = require('core/SetLanguageQuestion');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestration = require('services/caseOrchestration');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const content = require('./CheckYourAnswers.content');
const { parseBool } = require('@hmcts/one-per-page');

const constants = {
  YES_VALUE: 'Yes',
  NO_VALUE: 'No'
};

class CheckYourAnswers extends SetLanguageQuestion {
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

  get consts() {
    return constants;
  }

  get form() {
    if (this.req.session.SolicitorRepresentation && this.req.session.SolicitorRepresentation.response === this.consts.YES_VALUE) {
      return form({
        respSolicitorRepStatement: text.joi(
          this.errorMessage,
          Joi.required().valid(this.consts.YES_VALUE)
        )
      });
    }
    return form({
      respStatementOfTruth: text.joi(
        this.errorMessage,
        Joi.required().valid(this.consts.YES_VALUE)
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
    return this.req.session.SolicitorRepresentation && this.req.session.SolicitorRepresentation.response === this.consts.YES_VALUE;
  }

  sendToAPI(req) {
    const respondentAnswers = this.journey.values;
    if (this.isRepresentedBySol && this.isRespondentSolEnabled) {
      respondentAnswers.contactMethodIsDigital = this.consts.NO_VALUE;
      respondentAnswers.consentToReceivingEmails = this.consts.NO_VALUE;
      respondentAnswers.respStatementOfTruth = this.consts.NO_VALUE;
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
