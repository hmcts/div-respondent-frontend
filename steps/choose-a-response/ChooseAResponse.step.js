const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { getUserData } = require('middleware/ccd');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ChooseAResponse.content');

const proceed = 'proceed';
const disagree = 'disagree';

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.chooseAResponse;
  }

  get form() {
    const answers = [proceed, disagree];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    const question = content.en.title;
    return answer(this, {
      question,
      answer: this.fields.response.value === proceed ? content.en.fields.proceed.answer : content.en.fields.disagree.answer
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }

  next() {
    const proceedWithDivorce = this.fields.response.value === proceed;
    return branch(
      redirectTo(this.journey.steps.CheckYourAnswers).if(proceedWithDivorce),
      redirectTo(this.journey.steps.ConfirmDefence)
    );
  }
}

module.exports = ChooseAResponse;
