const modulePath = 'services/logger';

const { expect } = require('@hmcts/one-per-page-test-suite');
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

  describe('#getLogger', () => {
    it('returns nodejs logger with wrapWithUserInfo function', () => {
      const getLogger = logger.getLogger('name');
      expect(getLogger.hasOwnProperty('wrapWithUserInfo'));
    });
  });
});
