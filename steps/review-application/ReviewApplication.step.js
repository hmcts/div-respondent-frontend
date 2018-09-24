const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./ReviewApplication.content').en;

const yes = 'yes';

class ReviewApplication extends Question {
  static get path() {
    return config.paths.reviewApplication;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = [yes];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const statementOfTruth = text
      .joi(this.content.errors.required, validAnswers);

    return form({ statementOfTruth });
  }

  next() {
    return goTo(this.journey.steps.ChooseAResponse);
  }

  answers() {
    const question = content.readConfirmationQuestion;
    return answer(this, {
      question,
      answer: this.fields.statementOfTruth.value === yes ? content.readConfirmationYes : content.readConfirmationNo
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ReviewApplication;
