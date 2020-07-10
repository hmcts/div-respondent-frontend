const { BaseStep } = require('@hmcts/one-per-page');
const config = require('config');
const createToken = require('./createToken');
const { continueToNext, redirectTo } = require('@hmcts/one-per-page/flow');

class Equality extends BaseStep {
  static get path() {
    return config.paths.equality;
  }

  static pcqIdPropertyName(actor) {
    return actor === 'co-respondent' ? 'coRespondentPcqId' : 'respondentPcqId';
  }

  static toggleKey(actor) {
    return actor === 'co-respondent' ? 'ft_co_respondent_pcq' : 'ft_respondent_pcq';
  }

  returnPath(actor) {
    return actor === 'co-respondent' ? config.paths.coRespondent.checkYourAnswers : config.paths.respondent.checkYourAnswers;
  }

  handler(req, res) {
    const actor = req.session.pcqActor;
    const params = {
      serviceId: 'DIVORCE',
      actor: 'RESPONDENT',
      pcqId: req.session[Equality.pcqIdPropertyName(actor)],
      ccdCaseId: req.session.referenceNumber,
      partyId: req.idam.userDetails.email,
      returnUrl: req.headers.host + this.returnPath(actor),
      language: 'en'
    };

    params.token = createToken(params);

    const qs = Object.keys(params)
      .map(key => {
        return `${key}=${params[key]}`;
      })
      .join('&');

    res.redirect(`${config.services.equalityAndDiversity.url}${config.services.equalityAndDiversity.path}?${qs}`);
  }

  get flowControl() {
    return continueToNext(this);
  }

  next() {
    const actor = this.req.session.pcqActor;
    const step = actor === 'co-respondent' ? this.journey.steps.CrCheckYourAnswers : this.journey.steps.CheckYourAnswers;
    return redirectTo(step);
  }
}

module.exports = Equality;
