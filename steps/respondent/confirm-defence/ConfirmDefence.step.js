const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ConfirmDefence.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

const values = {
  confirm: 'confirm',
  changeResponse: 'changeResponse',
  twoYearSeparation: 'separation-2-years',
  fiveYearSeparation: 'separation-5-years'
};

class ConfirmDefence extends Question {
  static get path() {
    return config.paths.respondent.confirmDefence;
  }

  get const() {
    return values;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
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
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee'),
      getFeeFromFeesAndPayments('defended-petition-fee'),
      checkWelshToggle
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
