const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const config = require('config');
const content = require('./ContactDetails.content');
const i18next = require('i18next');
const commonContent = require('common/content');

const yes = 'Yes';

class ContactDetails extends Question {
  static get path() {
    return config.paths.respondent.contactDetails;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
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

    const values = { respConsentToEmail: yes };

    if (phoneNo && phoneNo.trim().length) {
      values.respPhoneNumber = phoneNo;
    }

    return values;
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

  next() {
    return redirectTo(this.journey.steps.Equality);
  }
}

module.exports = ContactDetails;
