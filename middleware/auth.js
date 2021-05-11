const sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  return next();
};

const cookiesCleaner = (req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie(req.app.get('cookieName'));
  }
  next();
};

module.exports = {
  sessionChecker,
  cookiesCleaner,
};
