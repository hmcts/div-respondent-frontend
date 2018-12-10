const Cookies = require('cookies');
const { Question } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/src/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const config = require('config');

class IdamLogin extends Question {
  static get path() {
    return config.paths.mock.idamLogin;
  }

  get form() {
    const answers = [
      'yesCaseStarted',
      'yesAdultery',
      'yes2yrSeparation',
      'yes5yrSeparation',
      'yes5yrSeparationTwoDates',
      'yesCaseNotLinked',
      'yesCaseNotLinkedAndInvalidPin',
      'yesCaseNotLinkedAndServerError',
      'yesCaseProgressedNoAos',
      'yesCaseProgressedUndefended',
      'yesCaseProgressedAwaitingAnswer',
      'yesCaseProgressedDefending',
      'no'
    ];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const success = text.joi(this.content.errors.required, validAnswers);

    return form({ success });
  }

  next() {
    const cookies = new Cookies(this.req, this.res);
    cookies.set('__auth-token', this.fields.success.value);
    return redirectTo(this.journey.steps.Authenticated);
  }
}

module.exports = IdamLogin;
