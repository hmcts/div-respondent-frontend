const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const checkWelshToggle = require('middleware/checkWelshToggle');

const constValues = {
  yes: 'Yes',
  no: 'No'
};

class NoConsentAreYouSure extends Question {
  static get path() {
    return config.paths.respondent.noConsentAreYouSure;
  }

  get session() {
    return this.req.session;
  }

  get feesAmendDivorce() {
    return this.res.locals.applicationFee['amend-fee'].amount;
  }

  get const() {
    return constValues;
  }

  get form() {
    const answers = [
      this.const.yes,
      this.const.no
    ];

    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    return answer(this, {
      answer: this.fields.response.value,
      hide: true
    });
  }

  values() {
    // overridden to not to send the values as part of the post
    return {};
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('amend-fee'),
      checkWelshToggle
    ];
  }

  next() {
    const doesConfirm = this.fields.response.value === this.const.yes;
    return branch(
      redirectTo(this.journey.steps.FinancialSituation).if(doesConfirm),
      redirectTo(this.journey.steps.ConsentDecree)
    );
  }
}

module.exports = NoConsentAreYouSure;
