const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./CrReviewApplication.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const values = {
  yes: 'Yes',
  adultery: 'adultery'
};

/**
 *  Review Application content should be same for DN, AOS Respondent and co-respondent journey.
 *  Any change to Mini petition should be made across all the Apps
 */
class CrReviewApplication extends Question {
  static get path() {
    return config.paths.coRespondent.reviewApplication;
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

    const confirmReadPetition = text
      .joi(this.content.errors.required, validAnswers);

    return form({ confirmReadPetition });
  }

  answers() {
    const sessionLanguage = i18next.language;
    const question = content[sessionLanguage].readConfirmationQuestion;
    return answer(this, {
      question,
      answer: this.fields.confirmReadPetition.value === this.const.yes ? content[sessionLanguage].readConfirmationYes : content[sessionLanguage].readConfirmationNo
    });
  }

  next() {
    return redirectTo(this.journey.steps.CrAdmitAdultery);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee'),
      getFeeFromFeesAndPayments('general-application-fee'),
      getFeeFromFeesAndPayments('application-financial-order-fee')
    ];
  }
}

module.exports = CrReviewApplication;
