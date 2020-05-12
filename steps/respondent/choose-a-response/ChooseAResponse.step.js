const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ChooseAResponse.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const consts = {
  proceed: 'proceed',
  proceedButDisagree: 'proceedButDisagree',
  defend: 'defend',
  yes: 'Yes',
  no: 'No',
  notAccept: 'NoNoAdmission',
  behavior: 'unreasonable-behaviour',
  desertion: 'desertion',
  separation5yrs: 'separation-5-years'
};

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.respondent.chooseAResponse;
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

  get isBehaviourOrDesertion() {
    const reasonForDivorce = this.session.originalPetition.reasonForDivorce;
    return reasonForDivorce === consts.behavior || reasonForDivorce === consts.desertion;
  }

  get isSeparation5yrs() {
    const reasonForDivorce = this.session.originalPetition.reasonForDivorce;
    return reasonForDivorce === consts.separation5yrs;
  }

  get form() {
    const constants = consts;
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
      case consts.proceed:
        return { respWillDefendDivorce: consts.no };
      case consts.proceedButDisagree:
        return { respWillDefendDivorce: consts.notAccept };
      case consts.defend:
        return { respWillDefendDivorce: consts.yes };
      default:
        throw new Error(`Unknown response to behavior or desertion: '${response}'`);
      }
    }

    const respWillDefendDivorce = response === consts.proceed ? consts.no : consts.yes;
    return { respWillDefendDivorce };
  }

  answers() {
    const response = this.fields.response.value;

    if (response) {
      const sessionLanguage = this.req.param('lng');
      let question = '';
      let cyaContent = '';
      if (sessionLanguage === 'cy') {
        question = content.cy.title;
        cyaContent = content.cy.fields[response].answer;
      } else {
        question = content.en.title;
        cyaContent = content.en.fields[response].answer;
      }
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
    const isProceed = response.value === consts.proceed;
    const fiveYearSeparation = this.session.originalPetition.reasonForDivorce === consts.separation5yrs;

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
