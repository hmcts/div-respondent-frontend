const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const constants = require('common/constants');
const content = require('./AdmitAdultery.content');

class AdmitAdultery extends Question {
  static get path() {
    return config.paths.respondent.admitAdultery;
  }

  get const() {
    return {
      admit: constants.userActions.admit,
      doNotAdmit: constants.userActions.doNotAdmit,
      yes: constants.userActions.yesOrNo.yes,
      no: constants.userActions.yesOrNo.no
    };
  }

  get caseData() {
    return this.req.session.originalPetition;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = [
      this.const.admit,
      this.const.doNotAdmit
    ];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    const question = content.en.title;
    const doesAdmit = this.fields.response.value === this.const.admit;
    const answerValue = doesAdmit ? content.en.fields.admit.label : content.en.fields.doNotAdmit.label;
    return answer(this, {
      question,
      answer: answerValue
    });
  }

  values() {
    const doesAdmit = this.fields.response.value === this.const.admit;
    return { respAdmitOrConsentToFact: doesAdmit ? this.const.yes : this.const.no };
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return redirectTo(this.journey.steps.ChooseAResponse);
  }
}

module.exports = AdmitAdultery;
