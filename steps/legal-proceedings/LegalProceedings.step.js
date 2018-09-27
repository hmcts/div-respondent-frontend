const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./LegalProceedings.content');

const yes = 'yes';
const no = 'no';

class LegalProceedings extends Question {
  static get path() {
    return config.paths.legalProceedings;
  }

  get form() {
    const answers = [yes, no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateCaseDetails = ({ exists = '', details = '' }) => {
      if (exists === 'yes' && !details.trim().length) {
        return false;
      }

      return true;
    };

    const fields = {
      exists: text.joi(this.content.errors.required, validAnswers),
      details: text
    };

    const legalProceedings = object(fields)
      .check(
        errorFor('details', this.content.errors.requireCaseDetails),
        validateCaseDetails
      );

    return form({ legalProceedings });
  }

  answers() {
    const question = content.en.cya.question;
    return answer(this, {
      question,
      answer: this.fields.legalProceedings.exists.value === yes ? this.fields.legalProceedings.details.value : content.en.fields.no.answer
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }
}

module.exports = LegalProceedings;
