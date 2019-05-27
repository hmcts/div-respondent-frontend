const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const constants = require('common/constants');
const content = require('./CrConfirmDefence.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

class CrConfirmDefence extends Question {
  static get path() {
    return config.paths.coRespondent.confirmDefence;
  }

  get const() {
    return {
      confirm: constants.userActions.confirm,
      changeResponse: constants.userActions.changeResponse,
      coRespondent: constants.caseFacts.coRespondent
    };
  }

  get session() {
    return this.req.session;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  values() {
    // override here and return empty object to avoid sending this step to backend
    return {};
  }

  get form() {
    const answers = [
      this.const.confirm,
      this.const.changeResponse
    ];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text.joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  answers() {
    const question = content.en.title;
    const doesConfirm = this.fields.response.value === this.const.confirm;
    const answerValue = doesConfirm ? content.en.fields.confirm.label : content.en.fields.changeResponse.label;
    return answer(this, {
      question,
      answer: answerValue,
      hide: true
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('defended-petition-fee')
    ];
  }

  next() {
    const changeResponse = this.fields.response.value === this.const.changeResponse;
    const costClaim = this.req.session.originalPetition.claimsCostsFrom;

    const condition = costClaim && costClaim.includes(this.const.coRespondent);
    return branch(
      redirectTo(this.journey.steps.CrChooseAResponse).if(changeResponse),
      redirectTo(this.journey.steps.CrAgreeToPayCosts).if(condition),
      redirectTo(this.journey.steps.CrContactDetails)
    );
  }
}

module.exports = CrConfirmDefence;
