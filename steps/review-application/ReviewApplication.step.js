/* eslint-disable */
const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

class ReviewApplication extends Question {
  static get path() {
    return config.paths.reviewApplication;
  }

  get session() {
 //   console.log(this.req.session);
    return this.req.session;
  }

  get form() {
    const answers = ['yes'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const statementOfTruth = text
      .joi(this.content.errors.required, validAnswers);

    return form({ statementOfTruth });
  }

  next() {
    return goTo(this.journey.steps.End);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ReviewApplication;
