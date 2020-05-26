const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./languagePreference.content');
const checkWelshToggle = require('middleware/checkWelshToggle');

const constValues = {
  agree: 'Yes',
  disagree: 'No',
  yes: 'Yes',
  no: 'No'
};

class languagePreference extends Question {
  static get path() {
    return config.paths.respondent.languagePreference;
  }

  get const() {
    return constValues;
  }

  get form() {
    const answers = [
      this.const.agree,
      this.const.disagree
    ];

    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text
      .joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    const answers = [];
    const sessionLanguage = this.req.param('lng');

    answers.push(answer(this, {
      question: content[sessionLanguage].cya.agree,
      answer: this.fields.jurisdiction.agree.value === this.validValues.yes ? content[sessionLanguage].fields.agree.answer : content[sessionLanguage].fields.disagree.answer
    }));

    return answers;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      checkWelshToggle
    ];
  }

  next() {
    return goTo(this.journey.steps.ChooseAResponse);
  }
}

module.exports = languagePreference;
