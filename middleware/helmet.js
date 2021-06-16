const config = require('config');
const helmet = require('helmet');
const hpkp = require('hpkp');

const setupHelmet = app => {
  // Protect against some well known web vulnerabilities
  // by setting HTTP headers appropriately.
  app.use(helmet());

  // Helmet content security policy (CSP) to allow only assets from same domain.
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\''],
      fontSrc: [
        '\'self\' data:',
        'https://webchat-client.ctsc.hmcts.net',
        'https://webchat-client.training.ctsc.hmcts.net',
        'https://webchat.training.ctsc.hmcts.net'
      ],
      scriptSrc: [
        '\'self\'',
        '\'unsafe-inline\'',
        'www.google-analytics.com',
        'hmctspiwik.useconnect.co.uk',
        'www.googletagmanager.com',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com'
      ],
      connectSrc: [
        '\'self\'',
        'https://webchat-client.ctsc.hmcts.net',
        'https://webchat-client.training.ctsc.hmcts.net',
        'https://webchat.ctsc.hmcts.net',
        'https://webchat.training.ctsc.hmcts.net',
        'wss://webchat.ctsc.hmcts.net'
      ],
      mediaSrc: [
        '\'self\'',
        'https://webchat-client.ctsc.hmcts.net',
        'https://webchat-client.training.ctsc.hmcts.net',
        'https://webchat.training.ctsc.hmcts.net'
      ],
      frameSrc: [
        '\'none\'',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        'https://webchat-client.ctsc.hmcts.net/chat-client/1/',
        'https://webchat-client.training.ctsc.hmcts.net/chat-client/1/',
        'https://webchat.training.ctsc.hmcts.net/chat-client/1/'
      ],
      imgSrc: [
        '\'self\'',
        'www.google-analytics.com',
        'hmctspiwik.useconnect.co.uk',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        'https://webchat-client.ctsc.hmcts.net/chat-client/1/',
        'https://webchat-client.training.ctsc.hmcts.net/chat-client/1/',
        'https://webchat.training.ctsc.hmcts.net/chat-client/1/'
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
