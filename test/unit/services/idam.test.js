const modulePath = 'services/idam';

const config = require('config');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const { expect, sinon, requireNoCache } = require('@hmcts/one-per-page-test-suite');

const previousEnvironment = config.environment;

describe(modulePath, () => {
  describe('idamExpressMiddleware if environment is not development or test', () => {
    let idam = {};

    before(() => {
      config.environment = 'other env';
      idam = requireNoCache(modulePath);
    });

    after(() => {
      config.environment = previousEnvironment;
    });

    it('exports a authenticate function', () => {
      expect(idam.hasOwnProperty('authenticate')).to.eql(true);
    });

    it('exports a landingPage function', () => {
      expect(idam.hasOwnProperty('landingPage')).to.eql(true);
    });

    it('exports a protect function', () => {
      expect(idam.hasOwnProperty('protect')).to.eql(true);
    });

    it('exports a logout function', () => {
      expect(idam.hasOwnProperty('logout')).to.eql(true);
    });
  });

  describe('mock middleware if environment is development or test', () => {
    let mockSpy = {};
    let idam = {};

    before(() => {
      config.environment = 'development';
      idam = requireNoCache(modulePath);
    });

    after(() => {
      config.environment = previousEnvironment;
    });

    afterEach(() => {
      mockSpy.restore();
    });

    it('mock authenticate', () => {
      mockSpy = sinon.stub(idamExpressMiddlewareMock, 'authenticate').returns(sinon.stub());

      idam.authenticate({
        get: sinon.stub().returns('http://some-host:4000/test')
      });

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock landingPage', () => {
      mockSpy = sinon.stub(idamExpressMiddlewareMock, 'landingPage').returns(sinon.stub());

      idam.landingPage({
        get: sinon.stub().returns('http://some-host:4000/test')
      });

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock protect', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'protect');

      idam.protect();

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock logout', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'logout');

      idam.logout();

      sinon.assert.calledOnce(mockSpy);
    });
  });

  describe('authenticate', () => {
    let authenticated = '';

    before(() => {
      authenticated = config.paths.authenticated;
      sinon.stub(idamExpressMiddlewareMock, 'authenticate')
        .returns(sinon.stub());
    });

    after(() => {
      config.paths.authenticated = authenticated;
      idamExpressMiddlewareMock.authenticate.restore();
    });

    it('sets correct redirect uri/hostName based on request', () => {
      const req = {
        hostname: 'some-host.com',
        query: {
          lng: 'cy'
        },
        get: sinon.stub()
          .withArgs('host')
          .returns('some-host.com:4000')
      };

      config.paths.authenticated = '/auth';

      const idam = requireNoCache(modulePath);

      idam.authenticate(req);

      const expected = Object.assign(idam.getIdamArgs(), {
        hostName: 'some-host.com',
        redirectUri: 'https://some-host.com:4000/auth',
        language: 'cy'
      });
      sinon.assert.calledOnce(idamExpressMiddlewareMock.authenticate);
      sinon.assert.calledWith(idamExpressMiddlewareMock.authenticate, expected);
    });
  });

  describe('idam args', () => {
    let sandbox = {};

    before(() => {
      sandbox = sinon.createSandbox();
    });

    after(() => {
      sandbox.restore();
    });

    it('sets correct idam args from config', () => {
      sandbox.stub(config, 'paths').value({
        authenticated: '/auth',
        index: '/index'
      });
      sandbox.stub(config, 'node').value({
        baseUrl: 'http://base-url'
      });
      sandbox.stub(config, 'services').value({
        idam: {
          apiUrl: 'http://api.idam',
          loginUrl: 'http://idam/login',
          secret: 'some-secret',
          clientId: 'div'
        }
      });

      const idam = requireNoCache(modulePath);

      const idamArgs = idam.getIdamArgs();

      expect(idamArgs).to.eql({
        indexUrl: '/index',
        idamApiUrl: 'http://api.idam',
        idamLoginUrl: 'http://idam/login',
        idamSecret: 'some-secret',
        idamClientID: 'div'
      });
    });
  });
});
