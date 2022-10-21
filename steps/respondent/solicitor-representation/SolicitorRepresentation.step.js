const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { branch, goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./SolicitorRepresentation.content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const values = {
  yes: 'Yes',
  no: 'No',
  twoYearSeparation: 'separation-2-years',
  adultery: 'adultery'
};

class SolicitorRepresentation extends Question {
  static get path() {
    return config.paths.respondent.solicitorRepresentation;
  }

  get const() {
    return values;
  }

  get session() {
    return this.req.session;
  }

  values() {
    const hasSolicitor = this.fields.response.value === this.const.yes;
    return { respondentSolicitorRepresented: hasSolicitor ? values.yes : values.no };
  }

  get form() {
    const answers = [
      this.const.yes,
      this.const.no
    ];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    const sessionLanguage = i18next.language;
    const question = content[sessionLanguage].title;
    const doesConfirm = this.fields.response.value === this.const.yes;
    const answerValue = doesConfirm ? content[sessionLanguage].fields.hasSolicitor.label : content[sessionLanguage].fields.noSolicitor.label;
    return answer(this, {
      question,
      answer: answerValue
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  get watches() {
    return {
      'SolicitorRepresentation.respondentSolicitorRepresented': (previousValue, currentValue, remove) => {
        if (currentValue === values.no) {
          remove('SolicitorDetails.solicitorDetails');
        }
      }
    };
  }

  next() {
    const petition = this.session.originalPetition;
    const hasSolicitorRep = this.fields.response.value === this.const.yes;
    const isTwoYrSep = petition && petition.reasonForDivorce === this.const.twoYearSeparation;
    const isAdulteryCase = petition && petition.reasonForDivorce === this.const.adultery;

    return branch(
      goTo(this.journey.steps.AdmitAdultery).if(isAdulteryCase && !hasSolicitorRep),
      goTo(this.journey.steps.ConsentDecree).if(isTwoYrSep && !hasSolicitorRep),
      goTo(this.journey.steps.ChooseAResponse).if(!hasSolicitorRep),
      goTo(this.journey.steps.SolicitorDetails)
    );
  }
}

module.exports = SolicitorRepresentation;
