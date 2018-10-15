const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./FinancialSituation.content');

const constValues = {
  yes: 'yes',
  no: 'no'
};

class FinancialSituation extends Question {
  static get path() {
    return config.paths.financialSituation;
  }

  get const() {
    return constValues;
  }

  get session() {
    return this.req.session;
  }

  answers() {
    const question = content.en.title;
    const answerYes = this.fields.respConsiderFinancialSituation.value === this.const.yes;
    const fieldValues = content.en.fields.respConsiderFinancialSituation;
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
    return [...super.middleware, idam.protect()];
  }
}

module.exports = FinancialSituation;
