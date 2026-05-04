export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  req.user = {
    userId: req.session.userId,
    is_admin: req.session.is_admin
  };
  next();
};

export default {
  requireAuth
};