const config = require('config');
const helmet = require('helmet');
const hpkp = require('hpkp');

const setupHelmet = app => {
  // Protect against some well known web vulnerabilities
  // by setting HTTP headers appropriately.
  app.use(helmet());

  const webchatUrl = config.services.antennaWebchat.url;
  // Helmet content security policy (CSP) to allow only assets from same domain.
  app.use(helmet.contentSecurityPolicy({
    directives: {
      fontSrc: ['\'self\' data:'],
      scriptSrc: [
        '\'self\'',
        '\'unsafe-inline\'',
        'www.google-analytics.com',
        'hmctspiwik.useconnect.co.uk',
        'www.googletagmanager.com',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        'https://ajax.googleapis.com',
        `https://${webchatUrl}`,
        `wss://${webchatUrl}`
      ],
      connectSrc: [
        '\'self\'',
        `https://${webchatUrl}`,
        `wss://${webchatUrl}`
      ],
      mediaSrc: [
        '\'self\'',
        `https://${webchatUrl}`,
        `wss://${webchatUrl}`
      ],
      frameSrc: [
        '\'none\'',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        `https://${webchatUrl}`,
        `wss://${webchatUrl}`
      ],
      imgSrc: [
        '\'self\'',
        'www.google-analytics.com',
        'hmctspiwik.useconnect.co.uk',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        `https://${webchatUrl}`,
        `wss://${webchatUrl}`
      ],
      styleSrc: [
        '\'self\'',
        '\'unsafe-inline\''
      ]

    }
  }));

  const maxAge = config.ssl.hpkp.maxAge;
  const sha256s = [ config.ssl.hpkp.sha256s, config.ssl.hpkp.sha256sBackup ];

  // HTTP public key pinning
  app.use(hpkp({ maxAge, sha256s }));

  // Helmet referrer policy
  app.use(helmet.referrerPolicy({ policy: 'origin' }));
};

module.exports = setupHelmet;
