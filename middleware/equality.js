'use strict';

const CONF = require('config');
const get = require('lodash').get;
const { v4: uuidv4 } = require('uuid');
const request = require('request-promise-native');
const logger = require('services/logger')
  .getLogger(__filename);
const Equality = require('steps/equality/Equality.step');

const doNotInvoke = (req, next) => {
  req.session.invokePcq = false;
  logger.infoWithReq(req, 'complete_equality_task', 'Skipping PCQ...');
  next();
};

const invokeEquality = (req, res, next) => {
  const uri = `${CONF.services.equalityAndDiversity.url}/health`;
  request.get({ uri, json: true })
    .then(json => {
      if (json.status && json.status === 'UP') {
        req.session[Equality.pcqIdPropertyName(req)] = uuidv4();
        req.session.invokePcq = true;

        logger.infoWithReq(req, 'complete_equality_task', 'PCQ properties set...');

        return next();
      }
      logger.errorWithReq(req, 'complete_equality_task', 'PCQ service is DOWN');
      doNotInvoke(req, next);
    })
    .catch(error => {
      logger.errorWithReq(req, 'complete_equality_task', error.message);
      doNotInvoke(req, next);
    });
};

const entryPoint = (req, res, next) => {
  if (req.method === 'POST') {
    if (Boolean(req.session.featureToggles[Equality.toggleKey(req)]) && !get(req.session, Equality.pcqIdPropertyName(req), false)) {
      invokeEquality(req, res, next);
    } else {
      doNotInvoke(req, next);
    }
  } else {
    return next();
  }
};

module.exports = entryPoint;
