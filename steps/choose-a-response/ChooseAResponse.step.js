const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ChooseAResponse.content');

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.chooseAResponse;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const respDefendsDivorce = text
      .joi(this.content.errors.required, validAnswers);

    return form({ respDefendsDivorce });
  }

  answers() {
    const question = content.en.title;
    return answer(this, {
      question,
      answer: this.fields.respDefendsDivorce.value === 'no' ? content.en.fields.proceed.answer : content.en.fields.disagree.answer
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    const proceedWithDivorce = this.fields.respDefendsDivorce.value === 'yes';
    return branch(
      redirectTo(this.journey.steps.Jurisdiction).if(proceedWithDivorce),
      redirectTo(this.journey.steps.ConfirmDefence)
    );
  }
}

module.exports = ChooseAResponse;
