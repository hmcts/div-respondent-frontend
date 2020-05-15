'use strict';

const FeatureToggle = require('core/utils/featureToggle');

const featureToggle = new FeatureToggle();

const checkWelshToggle = (req, res, next) => {
  res.locals.launchDarkly = {};

  return featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_welsh', featureToggle.toggleFeature);
};

module.exports = checkWelshToggle;
