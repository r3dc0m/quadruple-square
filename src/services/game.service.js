import models from "../models/index.js";
import gameSelectionService from "./gameSelection.service.js";
import boardService from "./board.service.js";
import { Op } from "sequelize";

const { Game, Player } = models;

const getActiveGameByPlayer = async (playerId) => {
    return await Game.findOne({
        where: {
            status: "active",
            [Op.or]: [
                { player_1: playerId },
                { player_2: playerId }
            ]
        },
        include: [
            { model: Player, as: "Player1" },
            { model: Player, as: "Player2" }
        ]
    });
};

const createGame = async (playerId, botId, playerCards) => {
    const player = await Player.findByPk(playerId);
    const bot = await Player.findByPk(botId);

    if (!player || player.is_bot || !bot || !bot.is_bot) {
        throw new Error("Invalid player or bot");
    }

    const game = await Game.create({
        player_1: playerId,
        player_2: botId,
        turn: playerId,
        status: "active",
        timestamp: new Date()
    });

    await gameSelectionService.reservePlayerCards(game.game_id, playerId, playerCards);

    const botCards = await gameSelectionService.selectBotCards(botId);
    await gameSelectionService.reserveBotCards(game.game_id, botId, botCards);
    await boardService.initializeGameBoard(game.game_id);

    return game;
};

const cancelGameByPlayer = async (playerId, gameId) => {
    const game = await Game.findOne({
        where: { game_id: gameId },
        include: [
            { model: Player, as: "Player1" },
            { model: Player, as: "Player2" }
        ]
    });

    if (!game) throw new Error("Game not found");
    if (game.player_1 !== playerId && game.player_2 !== playerId)
        throw new Error("Access denied");

    await gameSelectionService.cancelGameSelection(gameId, playerId);
    await Game.update({ status: "cancelled" }, { where: { game_id: gameId } });

    return game;
};

export default {
    getActiveGameByPlayer,
    createGame,
    cancelGameByPlayer
};