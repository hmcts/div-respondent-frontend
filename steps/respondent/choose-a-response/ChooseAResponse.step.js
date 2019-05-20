const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ChooseAResponse.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.respondent.chooseAResponse;
  }

  get consts() {
    return config.respChooseAResponse;
  }

  get session() {
    return this.req.session;
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get isBehaviourOrDesertion() {
    const reasonForDivorce = this.session.originalPetition.reasonForDivorce;
    return reasonForDivorce === this.consts.behavior || reasonForDivorce === this.consts.desertion;
  }

  get isSeparation5yrs() {
    const reasonForDivorce = this.session.originalPetition.reasonForDivorce;
    return reasonForDivorce === this.consts.fiveYearSeparation;
  }

  get form() {
    const constants = this.consts;
    const answers = [
      constants.proceed,
      constants.proceedButDisagree,
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

    if (this.isBehaviourOrDesertion) {
      switch (response) {
      case this.consts.proceed:
        return { respWillDefendDivorce: this.consts.no };
      case this.consts.proceedButDisagree:
        return { respWillDefendDivorce: this.consts.notAccept };
      case this.consts.defend:
        return { respWillDefendDivorce: this.consts.yes };
      default:
        throw new Error(`Unknown response to behavior or desertion: '${response}'`);
      }
    }

    const respWillDefendDivorce = response === this.consts.proceed ? this.consts.no : this.consts.yes;
    return { respWillDefendDivorce };
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
    const isDefend = response.value === this.consts.defend;
    const isProceed = response.value === this.consts.proceed;
    const fiveYearSeparation = this.session.originalPetition.reasonForDivorce === this.consts.fiveYearSeparation;

    return branch(
      redirectTo(this.journey.steps.ConfirmDefence)
        .if(isDefend && fiveYearSeparation),
      redirectTo(this.journey.steps.FinancialSituation)
        .if(isProceed && fiveYearSeparation),
      redirectTo(this.journey.steps.ConfirmDefence)
        .if(isDefend),
      redirectTo(this.journey.steps.Jurisdiction)
    );
  }
}

module.exports = ChooseAResponse;
