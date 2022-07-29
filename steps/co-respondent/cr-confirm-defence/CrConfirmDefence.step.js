const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrConfirmDefence.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const values = {
  confirm: 'confirm',
  changeResponse: 'changeResponse',
  coRespondent: 'correspondent'
};

class CrConfirmDefence extends Question {
  static get path() {
    return config.paths.coRespondent.confirmDefence;
  }

  get const() {
    return values;
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
    const sessionLanguage = i18next.language;
    const question = content[sessionLanguage].title;
    const doesConfirm = this.fields.response.value === this.const.confirm;
    const answerValue = doesConfirm ? content[sessionLanguage].fields.confirm.label : content[sessionLanguage].fields.changeResponse.label;
    return answer(this, {
      question,
      answer: answerValue,
      hide: true
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
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
