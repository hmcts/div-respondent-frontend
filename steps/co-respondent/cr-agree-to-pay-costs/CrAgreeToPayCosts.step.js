const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrAgreeToPayCosts.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const yes = 'Yes';
const no = 'No';

class CrAgreeToPayCosts extends Question {
  static get path() {
    return config.paths.coRespondent.agreeToPayCosts;
  }

  get session() {
    return this.req.session;
  }

  get config() {
    return config;
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
  }

  get form() {
    const answers = [yes, no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateDisagreeReason = ({ agree = '', noReason = '' }) => {
      if (agree === no && !noReason.trim().length) {
        return false;
      }

      return true;
    };

    const fields = {
      agree: text.joi(this.content.errors.required, validAnswers),
      noReason: text
    };

    const crAgreeToPayCosts = object(fields)
      .check(
        errorFor('noReason', this.content.errors.noReasonRequired),
        validateDisagreeReason
      );

    return form({ crAgreeToPayCosts });
  }

  values() {
    const agree = this.fields.crAgreeToPayCosts.agree.value;
    const noReason = this.fields.crAgreeToPayCosts.noReason.value;

    const values = {};
    values.coRespAgreeToCosts = agree;

    if (agree === no) {
      values.coRespCostsReason = noReason;
    }

    return values;
  }

  answers() {
    const answers = [];
    let agreeAnswer = content.en.fields.agree.answer;

    if (this.fields.crAgreeToPayCosts.agree.value === no) {
      agreeAnswer = content.en.fields.disagree.answer;
    }

    answers.push(answer(this, {
      question: content.en.cya.agree,
      answer: agreeAnswer
    }));

    if (this.fields.crAgreeToPayCosts.agree.value === no) {
      answers.push(answer(this, {
        question: content.en.cya.noReason,
        answer: this.fields.crAgreeToPayCosts.noReason.value
      }));
    }

    return answers;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee')
    ];
  }

  next() {
    return goTo(this.journey.steps.CrContactDetails);
  }
}

module.exports = CrAgreeToPayCosts;
