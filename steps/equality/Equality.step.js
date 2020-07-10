const { BaseStep } = require('@hmcts/one-per-page');
const config = require('config');
const createToken = require('./createToken');
const { continueToNext, redirectTo } = require('@hmcts/one-per-page/flow');

class Equality extends BaseStep {
  static get path() {
    return config.paths.equality;
  }

  static get returnPath() {
    return config.paths.respondent.checkYourAnswers;
  }

  static pcqIdPropertyName(actor) {
    return actor === 'co-respondent' ? 'coRespondentPcqId' : 'respondentPcqId';
  }

  static toggleKey(actor) {
    return actor === 'co-respondent' ? 'ft_co_respondent_pcq' : 'ft_respondent_pcq';
  }

  handler(req, res) {
    const params = {
      serviceId: 'DIVORCE',
      actor: 'RESPONDENT',
      pcqId: req.session[Equality.pcqIdPropertyName(req)],
      ccdCaseId: req.session.referenceNumber,
      partyId: req.idam.userDetails.email,
      returnUrl: req.headers.host + Equality.returnPath,
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
    return redirectTo(this.journey.steps.CheckYourAnswers);
  }
}

module.exports = Equality;
