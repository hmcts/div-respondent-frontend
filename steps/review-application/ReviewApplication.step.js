const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./ReviewApplication.content').en;
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const values = {
  yes: 'Yes',
  adultery: 'adultery',
  twoYearSeparation: 'separation-2-years'
};

class ReviewApplication extends Question {
  static get path() {
    return config.paths.reviewApplication;
  }

  get const() {
    return values;
  }

  get session() {
    return this.req.session;
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
<<<<<<< HEAD
  }

  get feesFinancialConsentOrder() {
    return this.res.locals.applicationFee['general-application-fee'].amount;
  }

  get feesDivorceSubmitFormA() {
    return this.res.locals.applicationFee['application-financial-order-fee'].amount;
=======
>>>>>>> modify service and middleware according to new backend requirements
  }

  get feesFinancialConsentOrder() {
    return this.res.locals.applicationFee.DivorceFinancialConsentOrderPayService.amount;
  }

  get feesDivorceSubmitFormA() {
    return this.res.locals.applicationFee.DivorceSubmitFormAPayService.amount;
  }

  get form() {
    const answers = [this.const.yes];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const respConfirmReadPetition = text
      .joi(this.content.errors.required, validAnswers);

    return form({ respConfirmReadPetition });
  }

  answers() {
    const question = content.readConfirmationQuestion;
    return answer(this, {
      question,
      answer: this.fields.respConfirmReadPetition.value === this.const.yes ? content.readConfirmationYes : content.readConfirmationNo
    });
  }

  next() {
    const petition = this.session.originalPetition;
    const isAdulteryCase = petition.reasonForDivorce === this.const.adultery;
    const twoYrSep = petition.reasonForDivorce === this.const.twoYearSeparation;
    return branch(
      goTo(this.journey.steps.AdmitAdultery).if(isAdulteryCase),
      goTo(this.journey.steps.ConsentDecree).if(twoYrSep),
      goTo(this.journey.steps.ChooseAResponse)
    );
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

module.exports = ReviewApplication;
