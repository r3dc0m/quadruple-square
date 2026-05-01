import models from "../models/index.js";
import boardService from "../services/board.service.js";
import { selectBotCards, reserveCardsForGame } from "../services/cardSelection.service.js";

const { Player, Game } = models;

const createGame = async (req, res) => {
    const { id: rawId, botId: rawBotId } = req.params;
    const playerCards = req.body.cards || [];

    const playerId = parseInt(rawId, 10);
    const botId = parseInt(rawBotId, 10);
    
    if (!rawId || isNaN(playerId) || playerId <= 0) {
        return res.status(400).json({
            error: `playerId must be a valid number. Received: ${rawId}`
        });
    }

    if (!rawBotId || isNaN(botId) || botId <= 0) {
        return res.status(400).json({
            error: `botId must be a valid number. Received: ${rawBotId}`
        });
    }
    if (!Array.isArray(playerCards) || playerCards.length !== 5 || playerCards.some(id => id <= 0)) {
        return res.status(400).json({
            error: "Please select exactly 5 valid cards"
        });
    }

    try {
        const player = await Player.findByPk(playerId);
        if (!player) {
            return res.status(404).json({
                error: `Player with id ${playerId} not found.`
            });
        }

        if (player.is_bot) {
            return res.status(400).json({
                error: `Player with id ${playerId} is a bot and cannot start a new game.`
            });
        }

        const bot = await Player.findByPk(botId);
        if (!bot) {
            return res.status(404).json({
                error: `Bot with id ${botId} not found.`
            });
        }

        if (!bot.is_bot) {
            return res.status(400).json({
                error: `Player with id ${botId} is not a bot.`
            });
        }

        const game = await Game.create({
            player_1: playerId,
            player_2: bot.player_id,
            turn: playerId,
            status: "active",
            timestamp: new Date()
        });

        // card lock
        await reserveCardsForGame(game.game_id, playerId, playerCards);
        const botCards = await selectBotCards(botId);
        await reserveCardsForGame(game.game_id, botId, botCards);

        await boardService.initializeGameBoard(game.game_id);
        const fullBoard = await boardService.getFullBoard(game.game_id);

        res.status(201).json({
            message: "Game created successfully.",
            game_id: game.game_id,
            board: fullBoard,
            players: {
                human: {
                    player_id: playerId,
                    player_name: player.player_name,
                    is_bot: player.is_bot
                },
                bot: {
                    player_id: bot.player_id,
                    player_name: bot.player_name,
                    is_bot: bot.is_bot
                }
            }
        });

    } catch (error) {
        console.error("Error in createGame:", error);
        res.status(500).json({
            error: "Error creating a new game."
        });
    }
};

export const functions = {
    createGame
};

export default functions;