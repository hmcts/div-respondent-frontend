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
});
