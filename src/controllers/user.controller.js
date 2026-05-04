const profile = async (req, res) => {
  const user = await models.User.findByPk(req.user.userId, {
    include: [models.Player]
  });
  res.json({
    id: user.user_id,
    name: user.user_name,
    email: user.user_email,
    currency: user.user_currency,
    is_admin: user.is_admin,
    player: user.Player
  });
};

const updateProfile = async (req, res) => {
  //tbd
};

export default {
  profile,
  updateProfile
}