'use strict';

const logger = require('services/logger').getLogger(__filename);
const CONF = require('config');

class FeatureToggle {
  callCheckToggle(req, res, next, launchDarkly, featureToggleKey, callbackFn, redirectPage) {
    return this.checkToggle({
      req,
      res,
      next,
      launchDarkly,
      featureToggleKey,
      callbackFn,
      redirectPage
    });
  }

  checkToggle(params) {
    const featureToggleKey = CONF.featureToggles[params.featureToggleKey];
    const ldUser = CONF.featureToggles.launchDarklyUser;

    try {
      return this.onceReady(params.launchDarkly, () => {
        return params.launchDarkly.client.variation(featureToggleKey, ldUser, false, (error, showFeature) => {
          if (error) {
            return params.next();
          }

          logger.infoWithReq(params.req, 'check_feature_toggle', `Checking feature toggle: ${params.featureToggleKey}, isEnabled:`, showFeature);
          return params.callbackFn({
            req: params.req,
            res: params.res,
            next: params.next,
            redirectPage: params.redirectPage,
            isEnabled: showFeature,
            featureToggleKey: params.featureToggleKey
          });
        });
      });
    } catch (error) {
      return params.next();
    }
  }

  onceReady(ld, callbackFn) {
    if (ld.ready) {
      callbackFn();
    } else {
      ld.client.once('ready', () => {
        ld.ready = true;
        callbackFn();
      });
    }
  }

  toggleFeature(params) {
    if (!params.req.session.featureToggles) {
      params.req.session.featureToggles = {};
    }
    params.req.session.featureToggles[params.featureToggleKey] = params.isEnabled;
    return params.next();
  }

  static appwideToggles(req, ctx, appwideToggles) {
    if (appwideToggles.length) {
      ctx.featureToggles = {};
      appwideToggles.forEach(toggleKey => {
        ctx.featureToggles[toggleKey] = FeatureToggle.isEnabled(req.session.featureToggles, toggleKey).toString();
      });
    }

    return ctx;
  }

  static isEnabled(featureToggles, key) {
    if (featureToggles && featureToggles[key]) {
      return true;
    }
    return false;
  }
}

module.exports = FeatureToggle;
