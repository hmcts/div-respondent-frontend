const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrChooseAResponse.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const consts = {
  proceed: 'proceed',
  defend: 'defend',
  yes: 'Yes',
  no: 'No'
};

class CrChooseAResponse extends Question {
  static get path() {
    return config.paths.coRespondent.chooseAResponse;
  }

  get consts() {
    return consts;
  }

  get session() {
    return this.req.session;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get form() {
    const constants = consts;
    const answers = [
      constants.proceed,
      constants.defend
    ];

    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const response = text
      .joi(this.content.errors.required, validAnswers);

    return form({ response });
  }

  values() {
    const response = this.fields.response.value;

    switch (response) {
    case consts.proceed:
      return { coRespDefendsDivorce: consts.no };
    case consts.defend:
      return { coRespDefendsDivorce: consts.yes };
    default:
      throw new Error(`Unknown response : '${response}'`);
    }
  }

  answers() {
    const response = this.fields.response.value;

    if (response) {
      const question = content.en.title;
      const cyaContent = content.en.fields[response].answer;
      return answer(this, {
        question,
        answer: cyaContent
      });
    }
    return super.answers();
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('defended-petition-fee')
    ];
  }

  next() {
    const response = this.fields.response;
    const isDefend = response.value === consts.defend;

    return branch(
      redirectTo(this.journey.steps.CrConfirmDefence)
        .if(isDefend),
      redirectTo(this.journey.steps.CrAgreeToPayCosts)
    );
  }
}

module.exports = CrChooseAResponse;