const modulePath = 'mocks/services/idam';

const idam = require(modulePath);
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

let req = {};
let res = {};
let next = {};
const idamArgs = {
  idamLoginUrl: 'idam.login.url',
  indexUrl: 'application.index.url'
};

const userDetails = {
  id: 'idamUserId',
  email: 'user@email.com'
};

describe(modulePath, () => {
  beforeEach(() => {
    req = {
      session: {},
      headers: {},
      connection: { encrypted: false }
    };
    next = sinon.stub();
    res = {
      redirect: sinon.stub(),
      getHeader: sinon.stub(),
      setHeader: sinon.stub(),
      clearCookie: sinon.stub()
    };
  });

  describe('#authenticate', () => {
    it('runs next and adds idam object if authenticated', () => {
      req.headers.cookie = `mockIdamUserDetails=${JSON.stringify(userDetails)};`;
      const middleware = idam.authenticate(idamArgs);
      middleware(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });

    it('redirects to idamLoginUrl if not authenticated', () => {
      const middleware = idam.authenticate(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledWith(res.redirect, idamArgs.idamLoginUrl);
    });
  });

  describe('#landingPage', () => {
    it('runs next and adds idam object if authenticated', () => {
      req.session.IdamLogin = { success: 'yes' };
      const middleware = idam.landingPage(idamArgs);
      middleware(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });

    it('redirects to idamLoginUrl if not authenticated', () => {
      req.session.IdamLogin = { success: 'no' };
      const middleware = idam.landingPage(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledWith(res.redirect, idamArgs.indexUrl);
    });
  });

  describe('#protect', () => {
    it('runs next and adds idam object if authenticated', () => {
      req.headers.cookie = `mockIdamUserDetails=${JSON.stringify(userDetails)};`;
      const middleware = idam.protect(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledOnce(next);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });

    it('redirects to idamLoginUrl if not authenticated', () => {
      const middleware = idam.protect(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledWith(res.redirect, idamArgs.indexUrl);
    });
  });

  describe('#logout', () => {
    it('runs next and removes idam object and removes cookie', () => {
      req.headers.cookie = `mockIdamUserDetails=${JSON.stringify(userDetails)};`;
      req.idam = { userDetails };
      const middleware = idam.logout(idamArgs);
      middleware(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(req.hasOwnProperty('idam')).to.eql(false);
      expect(res.clearCookie.calledOnce).to.eql(true);
    });

    it('runs next and removes idam object if no idam cookie', () => {
      req.idam = { userDetails };
      const middleware = idam.logout(idamArgs);
      middleware(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(req.hasOwnProperty('idam')).to.eql(false);
    });
  });
});
