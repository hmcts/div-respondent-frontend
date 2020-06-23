'use strict';

const FeatureToggle = require('core/utils/featureToggle');

const checkEqualityToggle = (req, res, next) => {
  if (!res.locals.featureToggle) {
    res.locals.featureToggle = new FeatureToggle();
  }
  if (!res.locals.launchDarkly) {
    res.locals.launchDarkly = {};
  }

  return res.locals.featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_pcq', res.locals.featureToggle.toggleFeature);
};

module.exports = checkEqualityToggle;
