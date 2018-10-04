const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ChooseAResponse.content');

class ChooseAResponse extends Question {
  static get path() {
    return config.paths.chooseAResponse;
  }

  get consts() {
    return {
      proceed: 'proceed',
      proceedButDoNotAdmit: 'proceedButDoNotAdmit',
      defend: 'defend',
      yes: 'yes',
      no: 'no'
    };
  }

  get session() {
    return this.req.session;
  }

  get isBehaviour() {
    return this.session.originalPetition.reasonForDivorce === 'unreasonable-behaviour';
  }

  get form() {
    const constants = this.consts;
    const answers = [
      constants.proceed,
      constants.proceedButDoNotAdmit,
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
    const consts = this.consts;

    const response = this.fields.response.value;
    if (this.isBehaviour) {
      switch (response) {
      case consts.proceed:
        return {
          respDefendsDivorce: consts.yes,
          respAdmitOrConsentToFact: consts.yes
        };
      case consts.proceedButDoNotAdmit:
        return {
          respDefendsDivorce: consts.yes,
          respAdmitOrConsentToFact: consts.no
        };
      case consts.defend:
        return {
          respDefendsDivorce: consts.no,
          respAdmitOrConsentToFact: consts.no
        };
        // no default
      }
    }

    const respDefendsDivorce = response === consts.proceed ? consts.yes : consts.no;
    return { respDefendsDivorce };
  }

  answers() {
    const question = content.en.title;
    return answer(this, {
      question,
      answer: this.fields.response.value === 'yes' ? content.en.fields.proceed.answer : content.en.fields.disagree.answer
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    const response = this.fields.response;
    const proceed = response.value === this.consts.proceed;
    return branch(redirectTo(this.journey.steps.Jurisdiction).if(proceed),
      redirectTo(this.journey.steps.ConfirmDefence)
    );
  }
}

module.exports = ChooseAResponse;
