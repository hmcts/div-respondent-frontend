const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./FinancialSituation.content');
const i18next = require('i18next');
const commonContent = require('common/content');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const constValues = {
  yes: 'Yes',
  no: 'No'
};

class FinancialSituation extends Question {
  static get path() {
    return config.paths.respondent.financialSituation;
  }

  get const() {
    return constValues;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
  }

  answers() {
    const sessionLanguage = i18next.language;
    const question = content[sessionLanguage].title;
    const answerYes = this.fields.respConsiderFinancialSituation.value === this.const.yes;
    const fieldValues = content[sessionLanguage].fields.respConsiderFinancialSituation;
    const answerText = answerYes ? fieldValues.yes : fieldValues.no;
    return answer(this, {
      question,
      answer: answerText
    });
  }

  get form() {
    const consentAnswers = [
      this.const.yes,
      this.const.no
    ];

    const validAnswers = Joi.string()
      .valid(consentAnswers)
      .required();

    const respConsiderFinancialSituation = text
      .joi(this.content.errors.required, validAnswers);

    return form({ respConsiderFinancialSituation });
  }

  next() {
    return goTo(this.journey.steps.Jurisdiction);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }
}

module.exports = FinancialSituation;
