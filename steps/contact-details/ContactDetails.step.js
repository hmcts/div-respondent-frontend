const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ContactDetails.content');

const yes = 'yes';

class ContactDetails extends Question {
  static get path() {
    return config.paths.contactDetails;
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

    const fields = {
      phoneNo: text.joi(this.content.errors.requireValidPhoneNo,
        validatePhoneNumber),
      consent: text.joi(this.content.errors.requireConsent, validAnswers)
    };

    const contactDetails = object(fields);

    return form({ contactDetails });
  }

  values() {
    return {
      respondentConsentToEmail: yes,
      respondentPhoneNumber: this.fields.contactDetails.phoneNo.value
    };
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: content.en.cya.phoneNumber,
      answer: this.fields.contactDetails.phoneNo.value
    }));

    answers.push(answer(this, {
      question: content.en.cya.emailConsent,
      answer: content.en.fields.consent.answer
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

module.exports = ContactDetails;
