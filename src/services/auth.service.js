import bcrypt from 'bcryptjs';
import models from '../models/index.js';

const { Player, User, PlayerCard } = models;

export const register = async (userData) => {

  const existingUser = await User.findOne({
    where: { user_email: userData.user_email }
  });
  if (existingUser) {
    throw new Error('User already exists!');
  }

  const newPlayer = await Player.create({
    player_name: userData.user_name,
    is_bot: false
  });

  const hashedPassword = await bcrypt.hash(userData.user_password, 10);
  const newUser = await User.create({
    user_id: newPlayer.player_id,
    user_name: newPlayer.player_name,
    user_email: userData.user_email,
    user_password: hashedPassword,
    user_currency: 100,
    is_admin: false
  });

  await PlayerCard.bulkCreate([
    { player_id: newPlayer.player_id, card_id: 1, amount: 13 },
    { player_id: newPlayer.player_id, card_id: 2, amount: 8 },
    { player_id: newPlayer.player_id, card_id: 3, amount: 5 },
    { player_id: newPlayer.player_id, card_id: 5, amount: 5 },
    { player_id: newPlayer.player_id, card_id: 8, amount: 5 }
  ]);

  return {
    user_id: newUser.user_id,
    player_id: newPlayer.player_id,
    user_email: newUser.user_email,
    is_admin: newUser.is_admin
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ where: { user_email: email } });

  if (!user || !await bcrypt.compare(password, user.user_password)) {
    throw new Error('Invalid credentials');
  }

  return {
    userId: user.user_id,
    email: user.user_email,
    is_admin: user.is_admin
  };
};

export default {
  register,
  login
}