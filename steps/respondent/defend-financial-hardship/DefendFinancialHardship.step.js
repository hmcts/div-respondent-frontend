const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./DefendFinancialHardship.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');

const yes = 'Yes';
const no = 'No';

class DefendFinancialHardship extends Question {
  static get path() {
    return config.paths.respondent.defendFinancialHardship;
  }

  get session() {
    return this.req.session;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
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
    const sessionLanguage = i18next.language;

    answers.push(answer(this, {
      question: content[sessionLanguage].cya.question,
      answer: this.fields.financialHardship.exists.value === yes ? content[sessionLanguage].fields.yes.answer : content[sessionLanguage].fields.no.answer
    }));

    if (this.fields.financialHardship.exists.value === yes) {
      answers.push(answer(this, {
        question: content[sessionLanguage].cya.details,
        answer: this.fields.financialHardship.details.value
      }));
    }

    return answers;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('defended-petition-fee'),
      checkWelshToggle
    ];
  }

  next() {
    return goTo(this.journey.steps.Jurisdiction);
  }
}

module.exports = DefendFinancialHardship;
