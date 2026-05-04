import { requireAuth } from './auth.js';

export const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (!req.user.is_admin) {
      return res.status(403).render('layout', {
        pageTitle: 'Access denied',
        contentView: '404',
        error: 'This page is for admin only.'
      });
    }
    next();
  });
};