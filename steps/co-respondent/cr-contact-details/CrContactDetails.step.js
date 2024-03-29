const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrContactDetails.content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const yes = 'Yes';

class CrContactDetails extends Question {
  static get path() {
    return config.paths.coRespondent.contactDetails;
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
      .regex(/^[0-9 +().-]{9,}$/);

    const fields = {
      telephone: text.joi(this.content.errors.requireValidTelephoneNo,
        validatePhoneNumber),
      consent: text.joi(this.content.errors.requireConsent, validAnswers)
    };

    const contactDetails = object(fields);

    return form({ contactDetails });
  }

  values() {
    const phoneNo = this.fields.contactDetails.telephone.value;

    const contactInfo = { consentToReceivingEmails: yes, contactMethodIsDigital: yes };

    if (phoneNo && phoneNo.trim().length) {
      contactInfo.phoneNumber = phoneNo;
    }

    const coRespAnswers = {};
    coRespAnswers.contactInfo = contactInfo;
    return coRespAnswers;
  }

  answers() {
    const phoneNo = this.fields.contactDetails.telephone.value;

    const answers = [];
    const sessionLanguage = i18next.language;

    if (phoneNo && phoneNo.trim().length) {
      answers.push(answer(this, {
        question: content[sessionLanguage].contactMethods.telephone.heading,
        answer: this.fields.contactDetails.telephone.value
      }));
    }

    answers.push(answer(this, {
      question: content[sessionLanguage].contactMethods.email.heading,
      answer: content[sessionLanguage].fields.email.label
    }));

    return answers;
  }

  get coRespEmailAddress() {
    if (this.session.originalPetition && this.session.originalPetition.coRespondentAnswers && this.session.originalPetition.coRespondentAnswers.contactInfo) {
      return this.session.originalPetition.coRespondentAnswers.contactInfo.emailAddress;
    }
    return '';
  }


  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  next() {
    return redirectTo(this.journey.steps.Equality);
  }
}

module.exports = CrContactDetails;
