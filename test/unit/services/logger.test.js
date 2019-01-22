const modulePath = 'services/logger';

const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const logger = require(modulePath);

const reqWithIdam = {
  originalUrl: 'url',
  method: 'POST',
  httpVersionMajor: '1',
  httpVersionMinor: '1',
  idam: { userDetails: { id: 'idam-id' } },
  session: { case: { id: 'case-id' } }
};

describe(modulePath, () => {
  describe('#wrapWithUserInfo', () => {
    it('wraps message with idam user id and case id', () => {
      const wrappedMessage = logger.wrapWithUserInfo(reqWithIdam, 'my message');
      expect(wrappedMessage).to.eql('IDAM ID: idam-id, CASE ID: case-id - my message');
    });

    it('returns message if no idam or case id details', () => {
      const wrappedMessage = logger.wrapWithUserInfo({}, 'my message');
      expect(wrappedMessage).to.eql('IDAM ID: unkown, CASE ID: unkown - my message');
    });
  });

  describe('#accessLogger', () => {
    it('returns access logger middleware that is excutable', () => {
      const middleware = logger.accessLogger();
      const res = {
        statusCode: 200,
        end: sinon.stub()
      };
      middleware(reqWithIdam, res, sinon.stub());
      res.end();
    });
  });

  describe('#getLogger', () => {
    it('returns nodejs logger with wrapWithUserInfo function', () => {
      const getLogger = logger.getLogger('name');
      expect(getLogger.hasOwnProperty('wrapWithUserInfo'));
    });
  });
});
