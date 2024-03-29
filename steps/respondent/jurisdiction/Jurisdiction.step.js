const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./Jurisdiction.content');
const i18next = require('i18next');
const commonContent = require('common/content');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const validValues = {
  yes: 'Yes',
  no: 'No'
};

class Jurisdiction extends Question {
  static get path() {
    return config.paths.respondent.jurisdiction;
  }

  get validValues() {
    return validValues;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
  }

  get form() {
    const answers = [this.validValues.yes, this.validValues.no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateDisagreeReason = ({ agree = '', reason = '' }) => {
      if (agree === this.validValues.no && !reason.trim().length) {
        return false;
      }

      return true;
    };

    const validateCountry = ({ agree = '', country = '' }) => {
      if (agree === this.validValues.no && !country.trim().length) {
        return false;
      }

      return true;
    };

    const fields = {
      agree: text.joi(this.content.errors.required, validAnswers),
      reason: text,
      country: text
    };

    const jurisdiction = object(fields)
      .check(
        errorFor('reason', this.content.errors.reasonRequired),
        validateDisagreeReason
      )
      .check(
        errorFor('country', this.content.errors.countryRequired),
        validateCountry
      );

    return form({ jurisdiction });
  }

  values() {
    const agree = this.fields.jurisdiction.agree.value;
    const reason = this.fields.jurisdiction.reason.value;
    const country = this.fields.jurisdiction.country.value;

    const values = {};
    values.respJurisdictionAgree = agree;

    if (agree === this.validValues.no) {
      values.respJurisdictionDisagreeReason = reason;
      values.respJurisdictionRespCountryOfResidence = country;
    }

    return values;
  }

  answers() {
    const answers = [];
    const sessionLanguage = i18next.language;

    answers.push(answer(this, {
      question: content[sessionLanguage].cya.agree,
      answer: this.fields.jurisdiction.agree.value === this.validValues.yes ? content[sessionLanguage].fields.agree.answer : content[sessionLanguage].fields.disagree.answer
    }));

    if (this.fields.jurisdiction.agree.value === this.validValues.no) {
      answers.push(answer(this, {
        question: content[sessionLanguage].cya.reason,
        answer: this.fields.jurisdiction.reason.value
      }));

      answers.push(answer(this, {
        question: content[sessionLanguage].cya.country,
        answer: this.fields.jurisdiction.country.value
      }));
    }

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
    return goTo(this.journey.steps.LegalProceedings);
  }
}

module.exports = Jurisdiction;
