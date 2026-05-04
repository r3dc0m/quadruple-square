import models from "../models/index.js";
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

  const allCards = await models.Card.findAll({
    order: [["card_id", "ASC"]]
  });

  const playerCards = await PlayerCard.findAll({
    where: { player_id: playerId },
    include: [models.Card]
  });

  const amountMap = {};
  for (const pc of playerCards) {
    amountMap[pc.card_id] = pc.amount;
  }

  const collection = allCards.map(card => {
    const amount = amountMap[card.card_id] || 0;
    return {
      card_id: card.card_id,
      card: card,
      amount
    };
  });

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

const createBot = async (req, res) => {
  const { player_name } = req.body;

  const name = player_name || `Bot_${Date.now() % 10000}`;

  try {
    const bot = await Player.create({
      player_name: name,
      is_bot: true
    });

    return res.redirect('/admin');
  } catch (error) {
    console.error('Error creating bot:', error);
    return res.status(500).send('Error creating bot');
  }
};

const deleteBot = async (req, res) => {
  const playerIdStr = req.params.playerId;
  const playerId = parseInt(playerIdStr, 10);

  if (isNaN(playerId) || playerId <= 0) {
    return res.status(400).send('Invalid bot ID');
  }

  try {
    const bot = await Player.findOne({
      where: { player_id: playerId, is_bot: true }
    });

    if (!bot) {
      console.log('Bot not found:', playerId);
      return res.status(404).send('Bot not found');
    }

    await PlayerCard.destroy({ where: { player_id: playerId } });
    await bot.destroy();

    res.redirect('/admin');

  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).send('Error deleting bot');
  }
};

export default {
  assignCards,
  assignCardsForm,
  adminPanel,
  createBot,
  deleteBot
}