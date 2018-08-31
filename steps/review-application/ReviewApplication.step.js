const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const ccd = require('middleware/ccd');
const loadMiniPetition = require('middleware/loadMiniPetition');

const CONF = require('config');

let insertSessionData; // eslint-disable-line init-declarations

if (CONF.environment === 'development') {
  insertSessionData = ccd.getUserData;
} else {
  insertSessionData = loadMiniPetition;
}

class ReviewApplication extends Question {
  static get path() {
    return config.paths.reviewApplication;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = ['yes'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const statementOfTruth = text
      .joi(this.content.errors.required, validAnswers);

    return form({ statementOfTruth });
  }

  next() {
    return goTo(this.journey.steps.End);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      insertSessionData
    ];
  }
}

module.exports = ReviewApplication;
