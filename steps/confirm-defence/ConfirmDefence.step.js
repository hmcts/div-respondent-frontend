const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch, goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ConfirmDefence.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');


const values = {
  confirm: 'confirm',
  changeResponse: 'changeResponse',
  twoYearSeparation: 'separation-2-years'
};

class ConfirmDefence extends Question {
  static get path() {
    return config.paths.confirmDefence;
  }

  get const() {
    return values;
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

  handler(req, res, next) {
    if (req.method === 'GET') {
      this.renderPage();
    } else if (req.method === 'POST') {
      this.parse();
      this.validate();

      if (this.valid) {
        this.store();
        this.next().redirect(req, res, next);
        req.session.confirmationAnswered = true;
        req.session.save();
      } else {
        this.storeErrors();
        res.redirect(this.path);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
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
    const petition = this.session.originalPetition;
    const doesConfirm = this.fields.response.value === this.const.confirm;
    const twoYrSep = petition && petition.reasonForDivorce === this.const.twoYearSeparation;
    if (this.req.session.confirmationAnswered && !doesConfirm) {
      // user already answered this page, avoid infinite redirect by forcing journey
      return goTo(this.journey.steps.Jurisdiction);
    }
    return branch(
      redirectTo(this.journey.steps.Jurisdiction).if(doesConfirm),
      redirectTo(this.journey.steps.ConsentDecree).if(!doesConfirm && twoYrSep),
      redirectTo(this.journey.steps.ChooseAResponse)
    );
  }
}

module.exports = ConfirmDefence;
