'use strict';

const FeatureToggle = require('core/utils/featureToggle');
const Equality = require('steps/equality/Equality.step');

const checkEqualityToggle = (req, res, next, actor) => {
  if (!res.locals.featureToggle) {
    res.locals.featureToggle = new FeatureToggle();
  }
  if (!res.locals.launchDarkly) {
    res.locals.launchDarkly = {};
  }

  return res.locals.featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly,
    Equality.toggleKey(actor), res.locals.featureToggle.toggleFeature);
};

module.exports = checkEqualityToggle;
