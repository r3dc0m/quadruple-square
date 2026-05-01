import { PlayerCard, GameSelectedCard } from "../models/index.js";
import { Op } from "sequelize";

const selectBotCards = async (botId, numCards = 5) => {
    const botCards = await PlayerCard.findAll({
        where: { player_id: botId, amount: { [Op.gt]: 0 } },
        order: sequelize.literal('RANDOM()'),
        limit: numCards
    });

    return botCards.map(pc => pc.card_id);
};

const reserveCardsForGame = async (gameId, playerId, cardIds) => {
    return sequelize.transaction(async (t) => {
        // Validate & reserve cards
        for (const cardId of cardIds) {
            const playerCard = await PlayerCard.findOne({
                where: { player_id: playerId, card_id: cardId },
                transaction: t
            });

            if (!playerCard || playerCard.amount <= 0) {
                throw new Error(`Insufficient card ${cardId} for player ${playerId}`);
            }

            await playerCard.decrement('amount', { by: 1, transaction: t });
        }

        // create game_selected_cards
        await GameSelectedCard.bulkCreate(
            cardIds.map(cardId => ({
                game_id: gameId,
                player_id: playerId,
                card_id: cardId,
                is_available: true
            })),
            { transaction: t }
        );
    });
};

export default {
    selectBotCards,
    reserveCardsForGame
};