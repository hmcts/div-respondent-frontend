const modulePath = 'middleware/privacy';

const os = require('os');
const setupPrivacy = require(modulePath);
const { sinon } = require('@hmcts/one-per-page-test-suite');

const app = {};

describe(modulePath, () => {
  beforeEach(() => {
    app.use = sinon.stub();
    app.get = sinon.stub();
  });

  it('revents website from being indexed', () => {
    setupPrivacy(app);
    const res = {
      setHeader: sinon.stub()
    };
    const next = sinon.stub();
    const middleware = app.use.firstCall.args[0];

    middleware({}, res, next);

    sinon.assert.calledWith(res.setHeader, 'X-Robots-Tag', 'noindex');
    sinon.assert.calledWith(res.setHeader, 'X-Served-By', os.hostname());
    sinon.assert
      .calledWith(res.setHeader, 'Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    sinon.assert.calledOnce(next);
  });

  it('adds handler for robots.txt', () => {
    setupPrivacy(app);
    sinon.assert.calledWith(app.get, '/robots.txt');
  });

  it('adds handler for robots.txt', () => {
    setupPrivacy(app);
    const res = {
      type: sinon.stub(),
      send: sinon.stub()
    };
    const middleware = app.get.firstCall.args[1];

    middleware({}, res);

    sinon.assert.calledWith(res.type, 'text/plain');
    sinon.assert.calledWith(res.send, 'User-agent: *\nDisallow: /');
  });
});
