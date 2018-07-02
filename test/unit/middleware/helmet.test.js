const modulePath = 'middleware/helmet';

const helmet = require('helmet');
const config = require('config');
const setupHelmet = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

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
        defaultSrc: ['\'self\''],
        fontSrc: ['\'self\' data:'],
        scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'www.google-analytics.com'],
        connectSrc: ['\'self\''],
        mediaSrc: ['\'self\''],
        frameSrc: ['\'none\''],
        imgSrc: ['\'self\'', 'www.google-analytics.com']
      }
    });

    contentSecurityPolicyStub.restore();
  });

  it('adds hpkp helmet to app middleware', () => {
    const hpkpStub = sinon.stub(helmet, 'hpkp');
    const maxAge = config.ssl.hpkp.maxAge;
    const sha256s = [ config.ssl.hpkp.sha256s, config.ssl.hpkp.sha256sBackup ];

    setupHelmet(app);

    sinon.assert.calledWith(hpkpStub, { maxAge, sha256s });

    hpkpStub.restore();
  });

  it('adds referrerPolicy helmet to app middleware', () => {
    const referrerPolicyStub = sinon.stub(helmet, 'referrerPolicy');
    setupHelmet(app);

    sinon.assert.calledWith(referrerPolicyStub, { policy: 'origin' });

    referrerPolicyStub.restore();
  });
});
