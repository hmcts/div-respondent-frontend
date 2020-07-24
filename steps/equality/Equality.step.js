const { Question } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const { v4: uuidv4 } = require('uuid');
const config = require('config');
const request = require('request-promise-native');
const logger = require('services/logger')
  .getLogger(__filename);
const Joi = require('joi');
const createToken = require('./createToken');

class Equality extends Question {
  static get path() {
    return config.paths.equality;
  }

  get entryPoint() {
    return this.req.session.entryPoint;
  }

  get isCoRespond() {
    return this.entryPoint === 'CrRespond';
  }

  pcqIdPropertyName() {
    return this.isCoRespond ? 'coRespondentPcqId' : 'respondentPcqId';
  }

  returnPath() {
    return this.isCoRespond ? config.paths.coRespondent.checkYourAnswers : config.paths.respondent.checkYourAnswers;
  }

  isEnabled() {
    const resp = config.features.respondentEquality === 'true';
    const cResp = config.features.coRespondentEquality === 'true';

    return this.isCoRespond ? cResp : resp;
  }

  handler(req, res, next) {
    const skipPcq = () => {
      return this.next().redirect(req, res, next);
    };

    // If enabled and not already called
    if (this.isEnabled() && !req.session.Equality) {
      // Check PCQ Health
      const uri = `${config.services.equalityAndDiversity.url}/health`;
      request.get({ uri, json: true })
        .then(json => {
          if (json.status && json.status === 'UP') {
            this.invokePcq(req, res);
          } else {
            logger.errorWithReq(req, 'Equality', 'PCQ service is DOWN');
            skipPcq();
          }
        })
        .catch(error => {
          logger.errorWithReq(req, 'Equality', error.message);
          skipPcq();
        });
    } else {
      skipPcq();
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

    // Encode partyId
    params.partyId = encodeURIComponent(params.partyId);

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
    const pcqId = this.fields.equality.pcqId.value;
    return pcqId ? { [this.pcqIdPropertyName()]: pcqId } : {};
  }

  next() {
    const step = this.isCoRespond ? this.journey.steps.CrCheckYourAnswers : this.journey.steps.CheckYourAnswers;
    return redirectTo(step);
  }
}

module.exports = Equality;
