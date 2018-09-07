const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { getUserData } = require('middleware/ccd');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.chooseAResponse;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = ['proceed', 'disagree'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }

  next() {
    return goTo(this.journey.steps.End);
  }
}

module.exports = ChooseAResponse;
