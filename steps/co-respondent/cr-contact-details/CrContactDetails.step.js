const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrContactDetails.content');

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

    const values = { coRespConsentToEmail: yes };

    if (phoneNo && phoneNo.trim().length) {
      values.coRespPhoneNumber = phoneNo;
    }

    return values;
  }

  answers() {
    const phoneNo = this.fields.contactDetails.telephone.value;

    const answers = [];

    if (phoneNo && phoneNo.trim().length) {
      answers.push(answer(this, {
        question: content.en.contactMethods.telephone.heading,
        answer: this.fields.contactDetails.telephone.value
      }));
    }

    answers.push(answer(this, {
      question: content.en.contactMethods.email.heading,
      answer: content.en.fields.email.label
    }));

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return redirectTo(this.journey.steps.CheckYourAnswers);
  }
}

module.exports = CrContactDetails;
