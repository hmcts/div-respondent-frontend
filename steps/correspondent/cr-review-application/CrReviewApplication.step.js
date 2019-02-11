const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./CrReviewApplication.content').en;
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const values = {
  yes: 'Yes',
  adultery: 'adultery'
};
class CrReviewApplication extends Question {
  static get path() {
    return config.paths.correspondent.reviewApplication;
  }

  get const() {
    return values;
  }

  get session() {
    return this.req.session;
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
  }

  get feesFinancialConsentOrder() {
    return this.res.locals.applicationFee['general-application-fee'].amount;
  }

  get feesDivorceSubmitFormA() {
    return this.res.locals.applicationFee['application-financial-order-fee'].amount;
  }

  get form() {
    const answers = [this.const.yes];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const coRespConfirmReadPetition = text
      .joi(this.content.errors.required, validAnswers);

    return form({ coRespConfirmReadPetition });
  }

  answers() {
    const question = content.readConfirmationQuestion;
    return answer(this, {
      question,
      answer: this.fields.coRespConfirmReadPetition.value === this.const.yes ? content.readConfirmationYes : content.readConfirmationNo
    });
  }

  next() {
    return redirectTo(this.journey.steps.AdmitAdultery);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee'),
      getFeeFromFeesAndPayments('general-application-fee'),
      getFeeFromFeesAndPayments('application-financial-order-fee')
    ];
  }
}

module.exports = CrReviewApplication;
