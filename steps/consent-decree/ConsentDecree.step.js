const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./ConsentDecree.content');

const constValues = {
  yes: 'yes',
  no: 'no'
};

class ConsentDecree extends Question {
  static get path() {
    return config.paths.consentDecree;
  }

  get const() {
    return constValues;
  }

  get session() {
    return this.req.session;
  }

  values() {
    const respAdmitOrConsentToFact = this.fields.response.consentDecree.value;
    const respDefendsDivorce = this.fields.response.willDefend.value === this.const.yes ? this.const.yes : this.const.no;
    return {
      respAdmitOrConsentToFact,
      respDefendsDivorce
    };
  }

  get form() {
    const answers = [
      this.const.yes,
      this.const.no
    ];
    const validConsentAnswers = Joi.string()
      .valid(answers)
      .required();

    const fields = {
      consentDecree: text.joi(
        this.content.errors.consentRequired,
        validConsentAnswers
      ),
      willDefend: text
    };

    const validateDefence = ({ consentDecree = '', willDefend = null }) => {
      return !(consentDecree === this.const.no && willDefend === null);
    };

    const response = object(fields)
      .check(
        errorFor('willDefend', this.content.errors.defenceRequired),
        validateDefence
      );

    return form({ response });
  }

  answers() {
    const answers = [];
    const questionConsent = content.en.fields.consentDecree.header;
    const doesConsent = this.fields.response.consentDecree.value === this.const.yes;
    const consentAnswerValue = doesConsent ? content.en.fields.consentDecree.labelYes : content.en.fields.consentDecree.labelNo;
    answers.push(answer(this, {
      question: questionConsent,
      answer: consentAnswerValue
    }));

    if (!doesConsent) {
      const questionDefend = content.en.fields.willDefend.header;
      const willDefend = this.fields.response.willDefend.value === this.const.yes;
      const defendValue = willDefend ? content.en.fields.willDefend.answerYes : content.en.fields.willDefend.answerNo;
      answers.push(answer(this, {
        question: questionDefend,
        answer: defendValue
      }));
    }

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    const doesConsent = this.fields.response.consentDecree.value === this.const.yes;
    const isDefending = this.fields.response.willDefend.value === this.const.yes;
    return branch(
      redirectTo(this.journey.steps.ConfirmDefence).if(!doesConsent && isDefending),
      redirectTo(this.journey.steps.NoConsentAreYouSure).if(!doesConsent && !isDefending),
      redirectTo(this.journey.steps.FinancialSituation)
    );
  }
}

module.exports = ConsentDecree;
