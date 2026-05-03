import models from "../models/index.js";
import sequelize from "../config/db.js";

const { GameSelectedCard, PlayerCard, Card } = models;

export const getStealableCards = async (gameId, loserId) => {
    const loserCards = await GameSelectedCard.findAll({
        where: {
            game_id: gameId,
            player_id: loserId
        },
        include: [{
            model: Card,
            as: "Card"
        }]
    });

    return loserCards.map(row => ({
        card_id: row.card_id,
        Card: row.Card,
        total_power: row.Card.power_up + row.Card.power_right +
            row.Card.power_down + row.Card.power_left
    }));
};

export const botChooseBestCard = (stealableCards) => {
    if (!stealableCards || stealableCards.length === 0) return null;

    const best = stealableCards.reduce((prev, current) =>
        (current.total_power > prev.total_power) ? current : prev
    );
    return best ? best.card_id : null;
};

export const stealCard = async (gameId, winnerId, chosenCardId) => {
    const game = await models.Game.findByPk(gameId);
    const loserId = winnerId === game.player_1 ? game.player_2 : game.player_1;

    return sequelize.transaction(async (t) => {
        const loserCard = await PlayerCard.findOne({
            where: { player_id: loserId, card_id: chosenCardId }, transaction: t
        });

        if (!loserCard) throw new Error("Card is not available for steal");
        await loserCard.decrement('amount', { by: 1, transaction: t });

        const [winnerCard, created] = await PlayerCard.findOrCreate({
            where: { player_id: winnerId, card_id: chosenCardId },
            defaults: { player_id: winnerId, card_id: chosenCardId, amount: 0 },
            transaction: t
        });
        await winnerCard.increment('amount', { by: 1, transaction: t });
    });
};

export const executeStealTransaction = async (gameId, winnerId, chosenCardId) => {
    return sequelize.transaction(async (t) => {
        const game = await models.Game.findByPk(gameId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!game || game.status !== 'waiting_steal') throw new Error("No steal available");

        const loserId = (winnerId === game.player_1) ? game.player_2 : game.player_1;

        await stealCard(gameId, winnerId, chosenCardId);

        const allUsedCards = await GameSelectedCard.findAll({
            where: { game_id: gameId },
            transaction: t
        });

        for (const entry of allUsedCards) {
            const ownerId = entry.player_id;

            const [record] = await PlayerCard.findOrCreate({
                where: { player_id: ownerId, card_id: entry.card_id },
                defaults: { player_id: ownerId, card_id: entry.card_id, amount: 0 },
                transaction: t
            });

            await record.increment('amount', { by: 1, transaction: t });
        }


        await game.update({ status: 'finished' }, { transaction: t });
    });
};

export default {
    getStealableCards,
    botChooseBestCard,
    stealCard,
    executeStealTransaction
};