const getRegister = (req, res) => {
  res.render('layout', {
    pageTitle: 'Register',
    currentPage: 'register',
    contentView: 'auth/register',
    error: null
  });
};

const getLogin = (req, res) => {
  res.render('layout', {
    pageTitle: 'Login',
    currentPage: 'login',
    contentView: 'auth/login',
    error: null
  });
};

export default {
  getLogin,
  getRegister
};