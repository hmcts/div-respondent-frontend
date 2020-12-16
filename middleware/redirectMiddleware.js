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
    logger.infoWithReq(req, 'redirect_to_dn', 'IDAM user does not match case respondent user, redirecting to DN');
    return res.redirect(getDnRedirectUrl(req));
  }

  return next();
};

module.exports = { redirectOnCondition };
