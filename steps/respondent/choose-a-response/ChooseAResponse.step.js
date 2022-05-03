const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ChooseAResponse.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const i18next = require('i18next');
const commonContent = require('common/content');
const { constants } = require('../../../core/utils/petitionHelper');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.respondent.chooseAResponse;
  }

  get consts() {
    return constants;
  }

  get session() {
    return this.req.session;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.divorceWho];
  }

  get feesDefendDivorce() {
    return this.res.locals.applicationFee['defended-petition-fee'].amount;
  }

  get isBehaviourOrDesertion() {
    const reasonForDivorce = this.session.originalPetition.reasonForDivorce;
    return reasonForDivorce === constants.behavior || reasonForDivorce === constants.desertion;
  }

  get isSeparation5yrs() {
    const reasonForDivorce = this.session.originalPetition.reasonForDivorce;
    return reasonForDivorce === constants.separation5yrs;
  }

  get form() {
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
      case constants.proceed:
        return { respWillDefendDivorce: constants.no };
      case constants.proceedButDisagree:
        return { respWillDefendDivorce: constants.notAccept };
      case constants.defend:
        return { respWillDefendDivorce: constants.yes };
      default:
        throw new Error(`Unknown response to behavior or desertion: '${response}'`);
      }
    }

    const respWillDefendDivorce = response === constants.proceed ? constants.no : constants.yes;
    return { respWillDefendDivorce };
  }

  answers() {
    const sessionLanguage = i18next.language;
    const response = this.fields.response.value;

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
      getWebchatOpeningHours,
      idam.protect(),
      getFeeFromFeesAndPayments('defended-petition-fee')
    ];
  }

  next() {
    const response = this.fields.response;
    const isDefend = response.value === constants.defend;
    const isProceed = response.value === constants.proceed;
    const fiveYearSeparation = this.session.originalPetition.reasonForDivorce === constants.separation5yrs;

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
