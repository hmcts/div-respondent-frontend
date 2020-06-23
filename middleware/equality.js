'use strict';

const CONF = require('config');
const get = require('lodash').get;
const { v4: uuidv4 } = require('uuid');
const request = require('request-promise-native');
const logger = require('services/logger')
  .getLogger(__filename);

const doNotInvoke = (req, next) => {
  req.session.pcq = {
    invoke: false
  };
  next();
};

const equality = (req, res, next) => {
  if (!!req.session.featureToggles['ft_pcq'] && !get(req.session.pcq, 'id', false)) {
    const uri = `${CONF.services.equalityAndDiversity.url}/health`;
    request.get({ uri, json: true })
      .then(json => {
        if (json.status && json.status === 'UP') {
          req.session.pcq = {
            id: uuidv4(),
            invoke: true
          }

          // Need to post pcqId to ccd here

          return next();
        }
        logger.errorWithReq(req, 'complete_equality_task', 'PCQ service is DOWN');
        doNotInvoke(req, next);
      })
      .catch(error => {
        logger.errorWithReq(req, 'complete_equality_task', error.message);
        doNotInvoke(req, next);
      });
  } else {
    doNotInvoke(req, next);
  }
};

module.exports = equality;
