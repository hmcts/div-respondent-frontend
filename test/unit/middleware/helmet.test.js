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
        fontSrc: ['\'self\' data:'],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'www.google-analytics.com',
          'hmctspiwik.useconnect.co.uk',
          'www.googletagmanager.com',
          'vcc-eu4.8x8.com',
          'vcc-eu4b.8x8.com'
        ],
        connectSrc: ['\'self\''],
        mediaSrc: ['\'self\''],
        frameSrc: ['\'none\'', 'vcc-eu4.8x8.com', 'vcc-eu4b.8x8.com'],
        imgSrc: ['\'self\'', 'www.google-analytics.com', 'hmctspiwik.useconnect.co.uk', 'vcc-eu4.8x8.com', 'vcc-eu4b.8x8.com']
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
