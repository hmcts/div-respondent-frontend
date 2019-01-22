const nodeJsLogging = require('@hmcts/nodejs-logging');
const { get } = require('lodash');

const wrapWithUserInfo = (req, msg) => {
  const idamId = get(req, 'idam.userDetails.id', 'unkown');
  const caseId = get(req, 'session.case.id', 'unkown');

  return `IDAM ID: ${idamId}, CASE ID: ${caseId} - ${msg}`;
};

module.exports.wrapWithUserInfo = wrapWithUserInfo;

module.exports.accessLogger = () => {
  return nodeJsLogging.Express.accessLogger({
    formatter: (req, res) => {
      const url = req.originalUrl || req.url;
      return wrapWithUserInfo(req, `"${req.method} ${url} HTTP/${req.httpVersionMajor}.${req.httpVersionMinor}" ${res.statusCode}`);
    }
  });
};

module.exports.getLogger = filename => {
  const logger = nodeJsLogging.Logger.getLogger(filename);

  logger.wrapWithUserInfo = wrapWithUserInfo;

  return logger;
};
