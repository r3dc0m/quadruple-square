import models from "../models/index.js";

const { GameSelectedCard, PlayerCard, Card } = models;

const getStealableCards = async (gameId, loserId) => {
    const loserCards = await GameSelectedCard.findAll({
        where: { game_id: gameId, player_id: loserId },
        include: [{
            model: Card,
            attributes: ['card_id', 'power_up', 'power_right', 'power_down', 'power_left']
        }]
    });

    return loserCards.map(row => ({
        card_id: row.card_id,
        total_power: row.Card.power_up + row.Card.power_right + 
                    row.Card.power_down + row.Card.power_left
    }));
};

const botChooseBestCard = (stealableCards) => {
    return stealableCards.reduce((best, current) => 
        current.total_power > best.total_power ? current : best
    )?.card_id || null;
};

const stealCard = async (gameId, winnerId, chosenCardId) => {
    const game = await models.Game.findByPk(gameId);
    const loserId = winnerId === game.player_1 ? game.player_2 : game.player_1;

    await PlayerCard.decrement('amount', {
        by: 1,
        where: { player_id: loserId, card_id: chosenCardId }
    });
    await PlayerCard.increment('amount', {
        by: 1,
        where: { player_id: winnerId, card_id: chosenCardId }
    });
};

export default {
    getStealableCards,
    botChooseBestCard,
    stealCard
};