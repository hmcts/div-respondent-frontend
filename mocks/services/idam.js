const Cookies = require('cookies');
const crypto = require('crypto');

const randomStringLength = 64;

const divIdamExpressMiddleware = {
  authenticate: idamArgs => {
    return (req, res, next) => {
      const cookies = new Cookies(req, res);
      const userDetails = cookies.get('mockIdamUserDetails');
      if (userDetails) {
        req.idam = { userDetails: JSON.parse(userDetails) };
        next();
      } else {
        res.redirect(idamArgs.idamLoginUrl);
      }
    };
  },

  landingPage: idamArgs => {
    return (req, res, next) => {
      const cookies = new Cookies(req, res);
      const mockIdamAuthenticated = req.session.hasOwnProperty('IdamLogin') && req.session.IdamLogin.success === 'yes';
      delete req.session.IdamLogin;

      if (mockIdamAuthenticated) {
        const token = crypto.randomBytes(randomStringLength).toString('hex');
        const userDetails = {
          id: `idamUserId-${token}`,
          email: 'user@email.com'
        };

        cookies.set('mockIdamUserDetails', JSON.stringify(userDetails));

        req.idam = { userDetails };
        next();
      } else {
        res.redirect(idamArgs.indexUrl);
      }
    };
  },

  protect: idamArgs => {
    return (req, res, next) => {
      const cookies = new Cookies(req, res);
      const userDetails = cookies.get('mockIdamUserDetails');
      if (userDetails) {
        req.idam = { userDetails: JSON.parse(userDetails) };
        next();
      } else {
        res.redirect(idamArgs.indexUrl);
      }
    };
  },

  logout: () => {
    return (req, res, next) => {
      const cookies = new Cookies(req, res);
      const userDetails = cookies.get('mockIdamUserDetails');
      if (userDetails) {
        res.clearCookie('mockIdamUserDetails');
      }
      delete req.idam;
      next();
    };
  },

  userDetails: () => {
    return (req, res, next) => {
      const cookies = new Cookies(req, res);
      const userDetails = cookies.get('mockIdamUserDetails');
      if (userDetails) {
        req.idam = { userDetails: JSON.parse(userDetails) };
      }
      next();
    };
  }
};

module.exports = divIdamExpressMiddleware;
