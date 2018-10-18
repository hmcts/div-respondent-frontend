const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./DefendFinancialHardship.content');

const yes = 'yes';
const no = 'no';

class DefendFinancialHardship extends Question {
  static get path() {
    return config.paths.defendFinancialHardship;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = [yes, no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateCaseDetails = ({ exists = '', details = '' }) => {
      if (exists === yes && !details.trim().length) {
        return false;
      }

      return true;
    };

    const fields = {
      exists: text.joi(this.content.errors.required, validAnswers),
      details: text
    };

    const financialHardship = object(fields)
      .check(
        errorFor('details', this.content.errors.requireDetails),
        validateCaseDetails
      );

    return form({ financialHardship });
  }

  values() {
    const exists = this.fields.financialHardship.exists.value;
    const details = this.fields.financialHardship.details.value;

    const values = { respHardshipDefenseResponse: exists };

    if (exists === yes) {
      values.respHardshipDescription = details;
    }

    return values;
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: content.en.cya.question,
      answer: this.fields.financialHardship.exists.value === yes ? content.en.fields.yes.answer : content.en.fields.no.answer
    }));

    if (this.fields.financialHardship.exists.value === yes) {
      answers.push(answer(this, {
        question: content.en.cya.details,
        answer: this.fields.financialHardship.details.value
      }));
    }

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return goTo(this.journey.steps.ConfirmDefence);
  }
}

module.exports = DefendFinancialHardship;
