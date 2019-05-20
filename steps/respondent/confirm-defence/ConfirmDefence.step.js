const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ConfirmDefence.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

class ConfirmDefence extends Question {
  static get path() {
    return config.paths.respondent.confirmDefence;
  }

  get const() {
    return config.respConfirmDefence;
  }

  get session() {
    return this.req.session;
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
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
      getFeeFromFeesAndPayments('petition-issue-fee'),
      getFeeFromFeesAndPayments('defended-petition-fee')
    ];
  }

  next() {
    const doesConfirm = this.fields.response.value === this.const.confirm;

    const petition = this.session.originalPetition;
    const twoYrSep = petition && petition.reasonForDivorce === this.const.twoYearSeparation;
    const fiveYrSep = petition && petition.reasonForDivorce === this.const.fiveYearSeparation;

    if (twoYrSep) {
      return branch(
        redirectTo(this.journey.steps.Jurisdiction).if(doesConfirm),
        redirectTo(this.journey.steps.ConsentDecree)
      );
    }

    if (fiveYrSep) {
      return branch(
        redirectTo(this.journey.steps.DefendFinancialHardship).if(doesConfirm),
        redirectTo(this.journey.steps.ChooseAResponse)
      );
    }

    return branch(
      redirectTo(this.journey.steps.Jurisdiction).if(doesConfirm),
      redirectTo(this.journey.steps.ChooseAResponse)
    );
  }
}

module.exports = ConfirmDefence;
