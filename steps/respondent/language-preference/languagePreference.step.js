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

    const languagePreferenceWelsh = text.joi(this.content.errors.required, validAnswers);

    return form({ languagePreferenceWelsh });
  }

  answers() {
    const answers = [];
    const languagePreferenceWelsh = this.req.session.languagePreferenceWelsh ? this.req.session.languagePreferenceWelsh : 'en';

    answers.push(answer(this, {
      question: content[languagePreferenceWelsh].cya.agree,
      answer: this.fields.languagePreferenceWelsh.value === this.const.yes ? content[languagePreferenceWelsh].fields.agree.answer : content[languagePreferenceWelsh].fields.disagree.answer
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
