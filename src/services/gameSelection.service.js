import models from "../models/index.js";
import sequelize from "../config/db.js";

const { PlayerCard, GameSelectedCard, Game, Card } = models;

const getSelection = async (playerId) => {
    const draftGame = await Game.findOne({
        where: { player_1: playerId, status: "draft" }
    });

    if (!draftGame) return [];

    return GameSelectedCard.findAll({
        where: { game_id: draftGame.game_id, player_id: playerId },
        include: [
            {
                model: Card,
                attributes: [
                    "card_id",
                    "card_name",
                    "image_path",
                    "power_up",
                    "power_right",
                    "power_down",
                    "power_left",
                    "rarity"
                ]
            }
        ],
        order: [["card_id", "ASC"]]
    });
};

const getPlayerCollection = async (playerId) => {
    return PlayerCard.findAll({
        where: { player_id: playerId },
        include: [
            {
                model: Card,
                attributes: [
                    "card_id",
                    "card_name",
                    "image_path",
                    "power_up",
                    "power_right",
                    "power_down",
                    "power_left",
                    "rarity"
                ]
            }
        ],
        order: [["card_id", "ASC"]]
    });
};

const addCard = async (playerId, cardId) => {
    return sequelize.transaction(async (t) => {

        let draftGame = await Game.findOne({
            where: { player_1: playerId, status: "draft" },
            transaction: t
        });

        if (!draftGame) {
            draftGame = await Game.create(
                {
                    player_1: playerId,
                    player_2: playerId,
                    status: "draft",
                    turn: playerId
                },
                { transaction: t }
            );
        }

        const countSelected = await GameSelectedCard.count({
            where: { game_id: draftGame.game_id },
            transaction: t
        });
        if (countSelected >= 5) {
            throw new Error("Maximum 5 cards");
        }

        const playerCard = await PlayerCard.findOne(
            {
                where: { player_id: playerId, card_id: cardId },
                transaction: t
            }
        );

        if (!playerCard || playerCard.amount <= 0) {
            throw new Error("No stock");
        }

        await playerCard.decrement("amount", { by: 1, transaction: t });

        await GameSelectedCard.create(
            {
                game_id: draftGame.game_id,
                player_id: playerId,
                card_id: cardId,
                is_available: true
            },
            { transaction: t }
        );
    });
};

const removeCard = async (playerId, cardId) => {
    return sequelize.transaction(async (t) => {
        const selectedCard = await GameSelectedCard.findOne({
            where: {
                player_id: playerId,
                card_id: cardId
            },
            transaction: t,
            limit: 1
        });

        if (!selectedCard) {
            throw new Error("Card not selected");
        }

        await PlayerCard.increment("amount", {
            by: 1,
            where: { player_id: playerId, card_id: cardId },
            transaction: t
        });

        await selectedCard.destroy({ transaction: t });
    });
};

const resetSelection = async (playerId) => {
    return sequelize.transaction(async (t) => {
        const draftGame = await Game.findOne(
            {
                where: { player_1: playerId, status: "draft" },
                transaction: t
            }
        );

        if (!draftGame) return;

        const selected = await GameSelectedCard.findAll(
            {
                where: { game_id: draftGame.game_id, player_id: playerId },
                transaction: t
            }
        );

        for (const row of selected) {
            await PlayerCard.increment(
                "amount",
                {
                    by: 1,
                    where: { player_id: playerId, card_id: row.card_id },
                    transaction: t
                }
            );
        }

        await GameSelectedCard.destroy(
            {
                where: { game_id: draftGame.game_id, player_id: playerId },
                transaction: t
            }
        );
    });
};

const reservePlayerCards = async (gameId, playerId, cardIds) => {
    if (!Array.isArray(cardIds) || cardIds.length !== 5) {
        throw new Error("Exactly 5 cards required");
    }

    return sequelize.transaction(async (t) => {
        await GameSelectedCard.destroy(
            {
                where: { game_id: gameId, player_id: playerId },
                transaction: t
            }
        );

        await GameSelectedCard.bulkCreate(
            cardIds.map((cardId) => ({
                game_id: gameId,
                player_id: playerId,
                card_id: cardId,
                is_available: true
            })),
            { transaction: t }
        );
    });
};

const selectBotCards = async (botId, numCards = 5) => {
    const botCards = await PlayerCard.findAll({
        where: { player_id: botId },
        order: sequelize.literal("RANDOM()"),
        limit: numCards,
        include: [Card]
    });
    return botCards.map((pc) => pc.card_id);
};

const reserveBotCards = async (gameId, botId, botCards) => {
    for (const cardId of botCards) {
        await GameSelectedCard.create({
            game_id: gameId,
            player_id: botId,
            card_id: cardId,
            is_available: true
        });
    }
};

const cancelGameSelection = async (gameId, playerId) => {
    const reserved = await GameSelectedCard.findAll({
        where: { game_id: gameId, player_id: playerId }
    });

    if (reserved.length === 0) return;

    return sequelize.transaction(async (t) => {
        for (const row of reserved) {
            await PlayerCard.increment(
                "amount",
                {
                    by: 1,
                    where: { player_id: playerId, card_id: row.card_id },
                    transaction: t
                }
            );
        }

        await GameSelectedCard.destroy(
            {
                where: { game_id: gameId, player_id: playerId },
                transaction: t
            }
        );
    });
};

export default {
    getSelection,
    getPlayerCollection,
    addCard,
    removeCard,
    resetSelection,
    reservePlayerCards,
    selectBotCards,
    reserveBotCards,
    cancelGameSelection
};