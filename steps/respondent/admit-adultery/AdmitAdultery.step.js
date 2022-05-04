const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./AdmitAdultery.content');
const i18next = require('i18next');
const commonContent = require('common/content');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const constValues = {
  admit: 'admit',
  doNotAdmit: 'doNotAdmit',
  yes: 'Yes',
  no: 'No'
};

class AdmitAdultery extends Question {
  static get path() {
    return config.paths.respondent.admitAdultery;
  }

  get const() {
    return constValues;
  }

  get caseData() {
    return this.req.session.originalPetition;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
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
    const sessionLanguage = i18next.language;
    const question = content[sessionLanguage].title;
    const doesAdmit = this.fields.response.value === this.const.admit;
    const answerValue = doesAdmit ? content[sessionLanguage].fields.admit.label : content[sessionLanguage].fields.doNotAdmit.label;
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
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  next() {
    return redirectTo(this.journey.steps.ChooseAResponse);
  }
}

module.exports = AdmitAdultery;
