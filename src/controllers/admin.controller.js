import models from "../models/index.js";
import collectionService from '../services/collection.service.js';

const { Player, PlayerCard } = models;

const adminPanel = async (req, res) => {
  const bots = await Player.findAll({ where: { is_bot: true } });
  const users = await models.User.findAll({ include: [models.Player] });

  for (const u of users) {
    const pc = await PlayerCard.findAll({ where: { player_id: u.user_id } });
    u.setDataValue('cardCount', pc.reduce((sum, p) => sum + p.amount, 0));
  }

  for (const b of bots) {
    const pc = await PlayerCard.findAll({ where: { player_id: b.player_id } });
    b.setDataValue('cardCount', pc.reduce((sum, p) => sum + p.amount, 0));
  }

  res.render('layout', {
    pageTitle: 'Admin Panel',
    currentPage: 'admin',
    contentView: 'admin',
    bots,
    users
  });
};

const assignCardsForm = async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);
  const player = await Player.findByPk(playerId);

  if (!player) {
    return res.status(404).render('layout', {
      pageTitle: 'Error',
      currentPage: 'admin',
      contentView: '404',
      error: 'Player not found.'
    });
  }

  const collection = await collectionService.getPlayerCollection(playerId);

  collection.sort((a, b) => a.card_id - b.card_id);

  res.render('layout', {
    pageTitle: `Assign cards to ${player.player_name}`,
    currentPage: 'admin',
    contentView: 'assign-cards',
    playerId,
    collection
  });
};

const assignCards = async (req, res) => {
  const { playerId, ...amounts } = req.body;

  const player = await Player.findByPk(playerId);
  if (!player) {
    return res.status(404).send('Player not found');
  }

  try {
    for (const cardIdStr in amounts) {
      const cardId = parseInt(cardIdStr, 10);
      const amount = Math.max(0, parseInt(amounts[cardIdStr], 10) || 0);

      if (isNaN(cardId) || cardId <= 0) {
        console.warn('Invalid cardId skipped:', cardIdStr);
        continue;
      }

      const [pc] = await PlayerCard.findOrCreate({
        where: { player_id: playerId, card_id: cardId },
        defaults: { player_id: playerId, card_id: cardId, amount: 0 }
      });

      if (amount > 0 || pc.amount > 0) {
        await pc.update({ amount });
      }
    }

    res.redirect('/admin');
  } catch (error) {
    console.error('Error assigning cards:', error);
    res.status(500).send('Error assigning cards');
  }
};


export default {
  assignCards,
  assignCardsForm,
  adminPanel
}