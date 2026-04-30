import models from "../models/index.js";
import boardService from "../services/board.service.js";

const { Player, Game } = models;


const createGame = async (req, res) => {

    console.log("DEBUG: Full req.params:", req.params);
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: `id must be a valid number. Received: ${id}`
        });
    }

    const playerId = parseInt(id, 10);

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

        const bot = await Player.findOne({ where: { is_bot: true } });
        if (!bot) {
            return res.status(404).json({
                error: "No bot players found to start the game."
            });
        }

        const game = await Game.create({
            player_1: playerId,
            player_2: bot.player_id,
            turn: playerId,
            status: "active",
            timestamp: new Date()
        });

        await boardService.initializeGameBoard(game.game_id);

        const fullBoard = await boardService.getFullBoard(game.game_id);

        res.status(201).json({
            message: "Game created successfully.",
            game_id: game.game_id,
            board: fullBoard,
            players: {
                human: { player_id: playerId, player_name: player.player_name, is_bot: player.is_bot },
                bot: { player_id: bot.player_id, player_name: bot.player_name, is_bot: bot.is_bot }
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