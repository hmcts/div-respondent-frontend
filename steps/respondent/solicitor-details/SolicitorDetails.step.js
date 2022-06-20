const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./SolicitorDetails.content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

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
    const validateEmail = Joi.string()
      .email({ minDomainSegments: 2 })
      .required();
    const requiredAnswer = Joi.string()
      .required();

    const fields = {
      solicitorName: text,
      firmName: text.joi(this.content.errors.requiredField, requiredAnswer),
      solicitorEmail: text.joi(this.content.errors.validEmail, validateEmail),
      telephone: text.joi(this.content.errors.requireValidTelephoneNo, validatePhoneNumber),
      solicitorRefNumber: text.joi(this.content.errors.requiredField, requiredAnswer),
      consent: text.joi(this.content.errors.requireConsent, validAnswers)
    };

    const solicitorDetails = object(fields);

    return form({ solicitorDetails });
  }

  values() {
    const solicitorName = this.fields.solicitorDetails.solicitorName.value;
    const firmNameSol = this.fields.solicitorDetails.firmName.value;
    const solicitorEmailAddress = this.fields.solicitorDetails.solicitorEmail.value;
    const phoneNo = this.fields.solicitorDetails.telephone.value;
    const solicitorReferenceNumber = this.fields.solicitorDetails.solicitorRefNumber.value;

    const values = {};

    if (solicitorName && solicitorName.trim().length) {
      values.respondentSolicitorName = solicitorName;
    }

    values.respondentSolicitorCompany = firmNameSol;
    values.respondentSolicitorEmail = solicitorEmailAddress;
    values.respondentSolicitorPhoneNumber = phoneNo;
    values.respondentSolicitorReference = solicitorReferenceNumber;
    values.respondentCorrespondenceSendToSolicitor = 'yes';

    return values;
  }

  answers() {
    const solicitorName = this.fields.solicitorDetails.solicitorName.value;

    const answers = [];
    const sessionLanguage = i18next.language;

    if (solicitorName && solicitorName.trim().length) {
      answers.push(answer(this, {
        question: content[sessionLanguage].fields.solicitorName.label,
        answer: this.fields.solicitorDetails.solicitorName.value
      }));
    }

    answers.push(answer(this, {
      question: content[sessionLanguage].fields.firmName.label,
      answer: this.fields.solicitorDetails.firmName.value
    }));

    answers.push(answer(this, {
      question: content[sessionLanguage].fields.solicitorEmail.label,
      answer: this.fields.solicitorDetails.solicitorEmail.value
    }));

    answers.push(answer(this, {
      question: content[sessionLanguage].fields.telephone.label,
      answer: this.fields.solicitorDetails.telephone.value
    }));

    answers.push(answer(this, {
      question: content[sessionLanguage].fields.solicitorRefNumber.label,
      answer: this.fields.solicitorDetails.solicitorRefNumber.value
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
    return redirectTo(this.journey.steps.SolicitorAddress);
  }
}

module.exports = SolicitorDetails;
