const logger = require('services/logger').getLogger(__filename);
const { getDnRedirectUrl } = require('core/utils/petitionHelper');

const redirectOnCondition = (req, res, next) => {
  const hasOriginalPetition = req.session && req.session.originalPetition;
  if (!hasOriginalPetition) {
    return next();
  }

  const originalPetition = req.session.originalPetition;
  const idamUserIsRespondent = req.idam.userDetails.email === originalPetition.respEmailAddress;

  if (!idamUserIsRespondent) {
    const redirectUrl = getDnRedirectUrl(req);
    logger.infoWithReq(req, 'redirect_to_dn', 'IDAM user does not match case respondent user, redirecting to DN');
    logger.infoWithReq(req, redirectUrl);
    return res.redirect(redirectUrl);
  }

  return next();
};

module.exports = { redirectOnCondition };
