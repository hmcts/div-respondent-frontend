const modulePath = 'services/logger';

const { sinon } = require('@hmcts/one-per-page-test-suite');
const nodeJsLogger = require('@hmcts/nodejs-logging').Logger.getLogger('name');
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
  describe('#accessLogger', () => {
    it('returns access logger middleware that is executable', () => {
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
    const req = {
      idam: {
        userDetails: {
          id: '123'
        }
      },
      session: {
        case: {
          id: '456'
        }
      }
    };
    const tag = 'tag';
    const message = 'message';
    const someArg = {};

    beforeEach(() => {
      sinon.stub(nodeJsLogger, 'info');
      sinon.stub(nodeJsLogger, 'warn');
      sinon.stub(nodeJsLogger, 'error');
    });

    afterEach(() => {
      nodeJsLogger.info.restore();
      nodeJsLogger.warn.restore();
      nodeJsLogger.error.restore();
    });

    it('calls logger.info', () => {
      const getLogger = logger.getLogger('name');

      getLogger.info(req, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLogger.info,
        `IDAM ID: ${req.idam.userDetails.id}, CASE ID: ${req.session.case.id}`,
        tag,
        message,
        someArg
      );
    });

    it('calls logger.warn', () => {
      const getLogger = logger.getLogger('name');

      getLogger.warn(req, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLogger.warn,
        `IDAM ID: ${req.idam.userDetails.id}, CASE ID: ${req.session.case.id}`,
        tag,
        message,
        someArg
      );
    });

    it('calls logger.error', () => {
      const getLogger = logger.getLogger('name');

      getLogger.error(req, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLogger.error,
        `IDAM ID: ${req.idam.userDetails.id}, CASE ID: ${req.session.case.id}`,
        tag,
        message,
        someArg
      );
    });
  });
});
