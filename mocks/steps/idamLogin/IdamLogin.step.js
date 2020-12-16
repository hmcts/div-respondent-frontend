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
      'yesAdulteryAmendedCase',
      'yes2yrSeparation',
      'yes5yrSeparation',
      'yes5yrSeparationTwoDates',
      'yesDesertion',
      'yesCaseNotLinked',
      'yesCaseNotLinkedAndInvalidPin',
      'yesCaseNotLinkedAndServerError',
      'yesCaseProgressedNoAos',
      'yesCaseProgressedUndefended',
      'yesCaseProgressedAwaitingAnswer',
      'yesAosOverdue',
      'yesCaseProgressedDefending',
      'awaitingDecreeAbsolute',
      'dnPronounced',
      'aosAwaitingSol',
      'no',
      'petitionerRedirect',
      'co-respondent',
      'co-respondent-amended-case',
      'coRespNotDefending',
      'coRespDefendingWaitingAnswer',
      'coRespDefendingSubmittedAnswer',
      'coRespTooLateToRespond',
      'coRespAwaitingPronouncementHearingDataFuture',
      'coRespDNPronouncedWithCosts',
      'coRespDNPronouncedWithoutCosts',
      'throwError',
      'yesDecreeNisiPronouncement',
      'dnIsRefused',
      'serviceApplicationNotApproved',
      'awaitingGeneralReferralPayment'
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
