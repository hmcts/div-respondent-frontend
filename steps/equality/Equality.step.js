const { Question } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const { v4: uuidv4 } = require('uuid');
const config = require('config');
const Joi = require('joi');
const createToken = require('./createToken');

class Equality extends Question {
  static get path() {
    return config.paths.equality;
  }

  get session() {
    return this.req.session;
  }

  get entryPoint() {
    return this.session.entryPoint;
  }

  pcqIdPropertyName() {
    return this.entryPoint === 'CrRespond' ? 'coRespondentPcqId' : 'respondentPcqId';
  }

  returnPath() {
    return this.entryPoint === 'CrRespond' ? config.paths.coRespondent.checkYourAnswers : config.paths.respondent.checkYourAnswers;
  }

  handler(req, res, next) {
    // If enabled and not already called
    if (config.features.equality && !req.session.Equality) {
      this.invokePcq(req, res);
    } else {
      this.next().redirect(req, res, next);
    }
  }

  invokePcq(req, res) {
    const pcqId = uuidv4();
    const params = {
      serviceId: 'DIVORCE',
      actor: 'RESPONDENT',
      pcqId,
      ccdCaseId: req.session.referenceNumber,
      partyId: req.idam.userDetails.email,
      returnUrl: req.headers.host + this.returnPath(),
      language: 'en'
    };

    params.token = createToken(params);

    const qs = Object.keys(params)
      .map(key => {
        return `${key}=${params[key]}`;
      })
      .join('&');

    const equalityForm = {
      body: {
        'equality.pcqId': pcqId
      }
    };
    this.fields = this.form.parse(equalityForm);
    this.store();

    res.redirect(`${config.services.equalityAndDiversity.url}${config.services.equalityAndDiversity.path}?${qs}`);
  }

  get form() {
    const fields = {
      pcqId: text.joi('', Joi.string())
    };

    const equality = object(fields);

    return form({ equality });
  }

  answers() {
    return [];
  }

  values() {
    return { [this.pcqIdPropertyName()]: this.fields.equality.pcqId.value };
  }

  next() {
    const step = this.entryPoint === 'CrRespond' ? this.journey.steps.CrCheckYourAnswers : this.journey.steps.CheckYourAnswers;
    return redirectTo(step);
  }
}

module.exports = Equality;
