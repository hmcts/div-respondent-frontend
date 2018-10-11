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
    // override here and return empty object to avoid sending this step to backend
    return {};
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

    const validateDefence = ({ consentDecree = '', willDefend = '' }) => {
      return !(consentDecree === this.const.yes && !willDefend);
    };

    const response = object(fields)
      .check(
        errorFor('willDefend', this.content.errors.defendRequired),
        validateDefence
      );

    return form({ response });
  }

  answers() {
    const answers = [];

    const questionConsent = this.content.fields.consent.header;
    const doesConsent = this.fields.consentDecree.value === this.const.yes;
    const consentAnswerValue = doesConsent ? content.en.fields.consentDecree.labelYes : content.en.fields.consentDecree.labelNo;
    answers.push(answer(this, {
      questionConsent,
      answer: consentAnswerValue
    }));

    if (!doesConsent) {
      const questionDefend = this.content.fields.defend.header;
      const willDefend = this.fields.willDefend.value === this.const.yes;
      const defendValue = willDefend ? content.en.fields.willDefend.labelYes : content.en.fields.willDefend.labelNo;
      answers.push(answer(this, {
        questionDefend,
        answer: defendValue
      }));
    }

    return answers;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    const doesConfirm = this.fields.response.value === this.const.confirm;
    return branch(
      redirectTo(this.journey.steps.Jurisdiction).if(doesConfirm),
      redirectTo(this.journey.steps.ChooseAResponse)
    );
  }
}

module.exports = ConsentDecree;
