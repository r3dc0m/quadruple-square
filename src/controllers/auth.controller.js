import authService from '../services/auth.service.js';

const register = async (req, res) => {
  try {
    const result = await authService.register({
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_password: req.body.user_password
    });

    req.session.userId = result.user_id;
    req.session.playerId = result.player_id;
    req.session.email = result.user_email;
    req.session.is_admin = result.is_admin;

    res.redirect('/');
  } catch (error) {
    res.render('layout', {
      pageTitle: 'Register Error',
      contentView: 'auth/register',
      error: error
    });
  }
};

const login = async (req, res) => {
  try {
    const userData = await authService.login(req.body.email, req.body.password);

    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        return res.status(500).redirect("/login");
      }

      req.session.userId = userData.userId;
      req.session.email = userData.email;
      req.session.is_admin = userData.is_admin;

      res.redirect(`/players/${userData.userId}/newgame`);
    });
  } catch (error) {
    res.render('layout', {
      pageTitle: 'Login Error',
      contentView: 'auth/login',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.redirect('/login');
    }

    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

export default {
  register,
  login,
  logout
}