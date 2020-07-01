const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./LanguagePreference.content.json');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');

const constValues = {
  agree: 'Yes',
  disagree: 'No',
  yes: 'Yes',
  no: 'No'
};

class LanguagePreference extends Question {
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
    const sessionLanguage = i18next.language;

    answers.push(answer(this, {
      question: content[sessionLanguage].cya.agree,
      answer: this.fields.languagePreferenceWelsh.value === this.const.yes ? content[sessionLanguage].fields.agree.answer : content[sessionLanguage].fields.disagree.answer
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

module.exports = LanguagePreference;
