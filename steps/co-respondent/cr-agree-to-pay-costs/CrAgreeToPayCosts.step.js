const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrAgreeToPayCosts.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');

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

    const costResponse = { costs: {} };

    costResponse.costs.agreeToCosts = agree;

    if (agree === no) {
      costResponse.costs.reason = noReason;
    }
    return costResponse;
  }

  answers() {
    const answers = [];
    const sessionLanguage = i18next.language;
    let agreeAnswer = content[sessionLanguage].fields.agree.answer;

    if (this.fields.crAgreeToPayCosts.agree.value === no) {
      agreeAnswer = content[sessionLanguage].fields.disagree.answer;
    }

    answers.push(answer(this, {
      question: content[sessionLanguage].cya.agree,
      answer: agreeAnswer
    }));

    if (this.fields.crAgreeToPayCosts.agree.value === no) {
      answers.push(answer(this, {
        question: content[sessionLanguage].cya.noReason,
        answer: this.fields.crAgreeToPayCosts.noReason.value
      }));
    }

    return answers;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee'),
      checkWelshToggle
    ];
  }

  next() {
    return goTo(this.journey.steps.CrContactDetails);
  }
}

module.exports = CrAgreeToPayCosts;
