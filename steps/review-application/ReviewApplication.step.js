const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./ReviewApplication.content').en;

const values = {
  yes: 'yes',
  adultery: 'adultery'
};

class ReviewApplication extends Question {
  static get path() {
    return config.paths.reviewApplication;
  }

  get const() {
    return values;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = [this.const.yes];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const respConfirmReadPetition = text
      .joi(this.content.errors.required, validAnswers);

    return form({ respConfirmReadPetition });
  }

  answers() {
    const question = content.readConfirmationQuestion;
    return answer(this, {
      question,
      answer: this.fields.respConfirmReadPetition.value === this.const.yes ? content.readConfirmationYes : content.readConfirmationNo
    });
  }

  next() {
    const originalPetition = this.session.originalPetition;
    const isAdulteryCase = originalPetition.reasonForDivorceClaimingAdultery;
    return branch(
      goTo(this.journey.steps.AdmitAdultery).if(isAdulteryCase),
      goTo(this.journey.steps.ChooseAResponse)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ReviewApplication;
