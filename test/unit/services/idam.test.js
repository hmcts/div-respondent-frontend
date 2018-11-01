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
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'authenticate');

      idam.authenticate();

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock landingPage', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'landingPage');

      idam.landingPage();

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

  describe('idam args', () => {
    let authenticated = '';
    let baseUrl = '';
    let indexUrl = '';
    let idamApiUrl = '';
    let idamLoginUrl = '';
    let idamSecret = '';
    let idamClientID = '';

    before(() => {
      authenticated = config.paths.authenticated;
      baseUrl = config.node.baseUrl;
      indexUrl = config.paths.index;
      idamApiUrl = config.services.idam.apiUrl;
      idamLoginUrl = config.services.idam.loginUrl;
      idamSecret = config.services.idam.secret;
      idamClientID = config.services.idam.clientId;
    });

    after(() => {
      config.paths.authenticated = authenticated;
      config.node.baseUrl = baseUrl;
      config.paths.index = indexUrl;
      config.services.idam.apiUrl = idamApiUrl;
      config.services.idam.loginUrl = idamLoginUrl;
      config.services.idam.secret = idamSecret;
      config.services.idam.clientId = idamClientID;
    });

    it('sets correct idam args from config', () => {
      config.paths.authenticated = '/auth';
      config.node.baseUrl = 'http://base-url';
      config.paths.index = '/index';
      config.services.idam.apiUrl = 'http://api.idam';
      config.services.idam.loginUrl = 'http://idam/login';
      config.services.idam.secret = 'some-secret';
      config.services.idam.clientId = 'div';

      const idam = requireNoCache(modulePath);

      const idamArgs = idam.getIdamArgs();

      expect(idamArgs.redirectUri).equal('http://base-url/auth');
      expect(idamArgs.hostName).equal('base-url');
      expect(idamArgs.indexUrl).equal('/index');
      expect(idamArgs.idamApiUrl).equal('http://api.idam');
      expect(idamArgs.idamLoginUrl).equal('http://idam/login');
      expect(idamArgs.idamSecret).equal('some-secret');
      expect(idamArgs.idamClientID).equal('div');
    });
  });
});
