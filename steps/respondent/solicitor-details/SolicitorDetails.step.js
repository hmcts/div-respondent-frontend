const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./SolicitorDetails.content');

const yes = 'Yes';

class SolicitorDetails extends Question {
  static get path() {
    return config.paths.respondent.solicitorDetails;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = [yes];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validatePhoneNumber = Joi.string()
      .regex(/^[0-9 +().-]{9,}$/)
      .required();

    const requiredAnswer = Joi.string()
      .required();


    const fields = {
      telephone: text.joi(this.content.errors.requireValidTelephoneNo,
        validatePhoneNumber),
      firmName: text.joi(this.content.errors.requiredField, requiredAnswer),
      consent: text.joi(this.content.errors.requireConsent, validAnswers)
    };

    const solicitorDetails = object(fields);

    return form({ solicitorDetails });
  }

  values() {
    const phoneNo = this.fields.solicitorDetails.telephone.value;
    const firmNameSol = this.fields.solicitorDetails.firmName.value;
    const values = {};
    if (phoneNo && phoneNo.trim().length) {
      values.respondentSolicitorPhone = phoneNo;
    }
    values.respondentSolicitorCompany = firmNameSol;
    return values;
  }

  answers() {
    const phoneNo = this.fields.solicitorDetails.telephone.value;

    const answers = [];

    if (phoneNo && phoneNo.trim().length) {
      answers.push(answer(this, {
        question: content.en.fields.telephone.label,
        answer: this.fields.solicitorDetails.telephone.value
      }));
    }

    answers.push(answer(this, {
      question: content.en.fields.firmName.label,
      answer: this.fields.solicitorDetails.firmName.value
    }));

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }
}

module.exports = SolicitorDetails;
