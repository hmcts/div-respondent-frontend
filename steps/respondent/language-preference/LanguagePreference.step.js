const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./LanguagePreference.content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const constValues = {
  agree: 'Yes',
  disagree: 'No',
  yes: 'Yes',
  no: 'No',
  adultery: 'adultery',
  twoYearSeparation: 'separation-2-years'
};

class LanguagePreference extends Question {
  static get path() {
    return config.paths.respondent.languagePreference;
  }

  get const() {
    return constValues;
  }

  get session() {
    return this.req.session;
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
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  next() {
    const petition = this.session.originalPetition;
    const isAdulteryCase = petition.reasonForDivorce === this.const.adultery;
    const twoYrSep = petition.reasonForDivorce === this.const.twoYearSeparation;
    return branch(
      goTo(this.journey.steps.AdmitAdultery).if(isAdulteryCase),
      goTo(this.journey.steps.ConsentDecree).if(twoYrSep),
      goTo(this.journey.steps.ChooseAResponse)
    );
  }
}

module.exports = LanguagePreference;
