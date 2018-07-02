const config = require('config');
const helmet = require('helmet');

const setupHelmet = app => {
  // Protect against some well known web vulnerabilities
  // by setting HTTP headers appropriately.
  app.use(helmet());

  // Helmet content security policy (CSP) to allow only assets from same domain.
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\''],
      fontSrc: ['\'self\' data:'],
      scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'www.google-analytics.com'],
      connectSrc: ['\'self\''],
      mediaSrc: ['\'self\''],
      frameSrc: ['\'none\''],
      imgSrc: ['\'self\'', 'www.google-analytics.com']
    }
  }));

  const maxAge = config.ssl.hpkp.maxAge;
  const sha256s = [ config.ssl.hpkp.sha256s, config.ssl.hpkp.sha256sBackup ];

  // Helmet HTTP public key pinning
  app.use(helmet.hpkp({ maxAge, sha256s }));

  // Helmet referrer policy
  app.use(helmet.referrerPolicy({ policy: 'origin' }));
};

module.exports = setupHelmet;
