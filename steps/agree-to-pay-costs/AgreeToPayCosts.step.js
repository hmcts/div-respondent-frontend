const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./AgreeToPayCosts.content');

const yes = 'Yes';
const no = 'No';
const differentAmount = 'DifferentAmount';

class AgreeToPayCosts extends Question {
  static get path() {
    return config.paths.agreeToPayCosts;
  }

  get session() {
    return this.req.session;
  }

  get config() {
    return config;
  }

  get form() {
    const answers = [yes, no, differentAmount];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateDisagreeReason = ({ agree = '', noReason = '' }) => {
      if (agree === no && !noReason.trim().length) {
        return false;
      }

      return true;
    };

    const validateNewAmount = ({ agree = '', newAmount = '' }) => {
      if (agree === differentAmount && (!newAmount.trim().length || isNaN(newAmount))) {
        return false;
      }

      return true;
    };

    const validateNewAmountReason = ({ agree = '', newAmountReason = '' }) => {
      if (agree === differentAmount && !newAmountReason.trim().length) {
        return false;
      }

      return true;
    };

    const fields = {
      agree: text.joi(this.content.errors.required, validAnswers),
      noReason: text,
      newAmount: text,
      newAmountReason: text
    };

    const agreeToPayCosts = object(fields)
      .check(
        errorFor('noReason', this.content.errors.noReasonRequired),
        validateDisagreeReason
      )
      .check(
        errorFor('newAmount', this.content.errors.newAmountRequired),
        validateNewAmount
      )
      .check(
        errorFor('newAmountReason', this.content.errors.newAmountReasonRequired),
        validateNewAmountReason
      );

    return form({ agreeToPayCosts });
  }

  values() {
    const agree = this.fields.agreeToPayCosts.agree.value;
    const noReason = this.fields.agreeToPayCosts.noReason.value;
    const newAmount = this.fields.agreeToPayCosts.newAmount.value;
    const newAmountReason = this.fields.agreeToPayCosts.newAmountReason.value;

    const values = {};
    values.respAgreeToCosts = agree;

    if (agree === no) {
      values.respCostsReason = noReason;
    }

    if (agree === differentAmount) {
      values.respCostsAmount = newAmount;
      values.respCostsReason = newAmountReason;
    }

    return values;
  }

  answers() {
    const answers = [];
    let agreeAnswer = content.en.fields.agree.answer;

    if (this.fields.agreeToPayCosts.agree.value === no) {
      agreeAnswer = content.en.fields.disagree.answer;
    }

    if (this.fields.agreeToPayCosts.agree.value === differentAmount) {
      agreeAnswer = content.en.fields.differentAmount.answer;
    }

    answers.push(answer(this, {
      question: content.en.cya.agree,
      answer: agreeAnswer
    }));

    if (this.fields.agreeToPayCosts.agree.value === no) {
      answers.push(answer(this, {
        question: content.en.cya.noReason,
        answer: this.fields.agreeToPayCosts.noReason.value
      }));
    }

    if (this.fields.agreeToPayCosts.agree.value === differentAmount) {
      const newAmount = this.fields.agreeToPayCosts.newAmount.value;
      const newAmountReason = this.fields.agreeToPayCosts.newAmountReason.value;

      answers.push(answer(this, {
        question: content.en.cya.newAmount,
        answer: content.en.poundSymbol + newAmount
      }));
      answers.push(answer(this, {
        question: content.en.cya.newAmountReason,
        answer: newAmountReason
      }));
    }

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return goTo(this.journey.steps.ContactDetails);
  }
}

module.exports = AgreeToPayCosts;
