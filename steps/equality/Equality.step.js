const { BaseStep } = require('@hmcts/one-per-page');
const config = require('config');
const createToken = require('./createToken');

class Equality extends BaseStep {
  static get path() {
    return config.paths.equality;
  }

  static get returnPath() {
    return config.paths.respondent.checkYourAnswers;
  }

  handler(req, res) {
    const params = {
      serviceId: 'DIVORCE',
      actor: 'RESPONDENT',
      pcqId: req.session.respondentPcqId,
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
}

module.exports = Equality;
