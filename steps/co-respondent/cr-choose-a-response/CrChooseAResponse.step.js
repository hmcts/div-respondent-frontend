const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./CrChooseAResponse.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const { constants } = require('../../../core/utils/petitionHelper');

class CrChooseAResponse extends Question {
  static get path() {
    return config.paths.coRespondent.chooseAResponse;
  }

  get consts() {
    return constants;
  }

  get session() {
    return this.req.session;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get form() {
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
    case constants.proceed:
      return { defendsDivorce: constants.no };
    case constants.defend:
      return { defendsDivorce: constants.yes };
    default:
      throw new Error(`Unknown response : '${response}'`);
    }
  }

  answers() {
    const response = this.fields.response.value;
    const sessionLanguage = i18next.language;

    if (response) {
      const question = content[sessionLanguage].title;
      const cyaContent = content[sessionLanguage].fields[response].answer;
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
      getFeeFromFeesAndPayments('defended-petition-fee'),
      checkWelshToggle
    ];
  }

  next() {
    const response = this.fields.response;
    const isDefend = response.value === constants.defend;
    const costClaim = this.req.session.originalPetition.claimsCostsFrom;

    const condition = costClaim && costClaim.includes(constants.coRespondent);

    return branch(
      redirectTo(this.journey.steps.CrConfirmDefence)
        .if(isDefend),
      redirectTo(this.journey.steps.CrAgreeToPayCosts).if(condition),
      redirectTo(this.journey.steps.CrContactDetails)
    );
  }
}

module.exports = CrChooseAResponse;
