const modulePath = 'middleware/helmet';

const proxyquire = require('proxyquire');
const helmet = require('helmet');
const config = require('config');
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

const hpkpStub = sinon.stub();
const setupHelmet = proxyquire(modulePath, { hpkp: hpkpStub });

const app = {};

describe(modulePath, () => {
  beforeEach(() => {
    app.use = sinon.stub();
  });

  it('adds core helmet to app middleware', () => {
    setupHelmet(app);
    expect(app.use.firstCall.args.toString()).to.eql(helmet().toString());
  });

  it('adds contentSecurityPolicy helmet to app middleware', () => {
    const contentSecurityPolicyStub = sinon.stub(helmet, 'contentSecurityPolicy');
    setupHelmet(app);

    sinon.assert.calledWith(contentSecurityPolicyStub, {
      directives: {
        defaultSrc: ['*'],
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
          'vcc-eu4b.8x8.com',
          'https://webchat-client.ctsc.hmcts.net',
          'https://webchat-client.training.ctsc.hmcts.net',
          'https://webchat.ctsc.hmcts.net',
          'https://webchat.training.ctsc.hmcts.net'
        ],
        connectSrc: [
          '\'self\'',
          'https://webchat-client.ctsc.hmcts.net',
          'https://webchat-client.training.ctsc.hmcts.net',
          'https://webchat.ctsc.hmcts.net',
          'https://webchat.training.ctsc.hmcts.net',
          'wss://webchat.ctsc.hmcts.net',
          'wss://webchat.training.ctsc.hmcts.net'
        ],
        mediaSrc: [
          '\'self\'',
          'https://webchat-client.ctsc.hmcts.net',
          'https://webchat-client.training.ctsc.hmcts.net',
          'https://webchat.ctsc.hmcts.net',
          'https://webchat.training.ctsc.hmcts.net'
        ],
        frameSrc: [
          '\'none\'',
          'vcc-eu4.8x8.com',
          'vcc-eu4b.8x8.com',
          'https://webchat-client.ctsc.hmcts.net/chat-client/1/',
          'https://webchat-client.training.ctsc.hmcts.net/chat-client/1/',
          'https://webchat.ctsc.hmcts.net',
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
          'https://webchat.ctsc.hmcts.net',
          'https://webchat.training.ctsc.hmcts.net/chat-client/1/'
        ],
        styleSrc: [
          '\'self\'',
          '\'unsafe-inline\''
        ]
      }
    });

    contentSecurityPolicyStub.restore();
  });

  it('adds hpkp helmet to app middleware', () => {
    const maxAge = config.ssl.hpkp.maxAge;
    const sha256s = [ config.ssl.hpkp.sha256s, config.ssl.hpkp.sha256sBackup ];

    setupHelmet(app);

    sinon.assert.calledWith(hpkpStub, { maxAge, sha256s });
  });

  it('adds referrerPolicy helmet to app middleware', () => {
    const referrerPolicyStub = sinon.stub(helmet, 'referrerPolicy');
    setupHelmet(app);

    sinon.assert.calledWith(referrerPolicyStub, { policy: 'origin' });

    referrerPolicyStub.restore();
  });
});
