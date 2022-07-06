const i18next = require('i18next').createInstance();
const logger = require('app/services/logger').logger(__filename);
const CONF = require('config');

function commonContentMiddleware(req, res, next) {
  // eslint-disable-next-line global-require
  const content = require('app/common/content');

  i18next.init(content, error => {
    if (error) {
      logger.errorWithReq(null, 'i18next_error', 'Failed to initialise i18next', error.message);
    }
  });

  i18next.languages = CONF.languages;
  i18next.changeLanguage(req.session.language);

  const i18nProxy = new Proxy(i18next, {
    get: (target, key) => {
      if (target.exists(key)) {
        return target.t(key, {
          courtPhoneNumberEn: CONF.commonProps.courtPhoneNumberEn,
          courtOpeningHourEn: CONF.commonProps.courtOpeningHourEn
        });
      }
      return '';
    }
  });

  req.i18n = i18next;
  res.locals.i18n = i18next;
  res.locals.common = i18nProxy;
  res.locals.content = i18nProxy;

  next();
}

module.exports = commonContentMiddleware;
