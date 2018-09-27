const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { getUserData } = require('middleware/ccd');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ConfirmDefence.content');

const confirm = 'confirm';
const changeResponse = 'changeResponse';

class ConfirmDefence extends Question {
  static get path() {
    return config.paths.confirmDefence;
  }

  get form() {
    const answers = [confirm, changeResponse];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    const question = content.en.title;
    const answerValue = this.fields.response.value === confirm ? content.en.fields.confirm.answer : content.en.fields.changeResponse.answer;
    return answer(this, {
      question,
      answer: answerValue,
      hide: true
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }

  next() {
    const nextStep = this.fields.response.value === confirm ? this.journey.steps.CheckYourAnswers : this.journey.steps.ChooseAResponse;
    return redirectTo(nextStep);
  }
}

module.exports = ConfirmDefence;
