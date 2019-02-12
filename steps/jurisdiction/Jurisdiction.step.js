const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./Jurisdiction.content');

const validValues = {
  yes: 'Yes',
  no: 'No'
};

class Jurisdiction extends Question {
  static get path() {
    return config.paths.jurisdiction;
  }

  get validValues() {
    return validValues;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = [this.validValues.yes, this.validValues.no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateDisagreeJurisdiction = disagreeJurisdictionField => {
      const value = disagreeJurisdictionField.value;
      if (this.fields.jurisdictionAgree.value === this.validValues.no && (!value || !value.trim().length)) {
        return false;
      }
      return true;
    };

    const fields = {
      agree: text.joi(this.content.errors.required, validAnswers),
      reason: text.checkField(
        this.content.errors.reasonRequired,
        validateDisagreeJurisdiction
      ),
      country: text.checkField(
        this.content.errors.countryRequired,
        validateDisagreeJurisdiction
      )
    };

    return form({
      jurisdictionAgree: fields.agree,
      jurisdictionReason: fields.reason,
      jurisdictionCountry: fields.country
    });
  }

  values() {
    const agree = this.fields.jurisdictionAgree.value;
    const reason = this.fields.jurisdictionReason.value;
    const country = this.fields.jurisdictionCountry.value;

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

    answers.push(answer(this, {
      question: content.en.cya.agree,
      answer: this.fields.jurisdictionAgree.value === this.validValues.yes ? content.en.fields.agree.answer : content.en.fields.disagree.answer
    }));

    if (this.fields.jurisdictionAgree.value === this.validValues.no) {
      answers.push(answer(this, {
        question: content.en.cya.reason,
        answer: this.fields.jurisdictionReason.value
      }));

      answers.push(answer(this, {
        question: content.en.cya.country,
        answer: this.fields.jurisdictionCountry.value
      }));
    }

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return goTo(this.journey.steps.LegalProceedings);
  }
}

module.exports = Jurisdiction;
