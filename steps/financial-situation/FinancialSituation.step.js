const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');

const consts = {
  yes: 'yes',
  no: 'no'
};

class FinancialSituation extends Question {
  static get path() {
    return config.paths.financialSituation;
  }

  get consts() {
    return consts;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  get form() {
    const consentAnswers = [
      consts.yes,
      consts.no
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
}

module.exports = FinancialSituation;
