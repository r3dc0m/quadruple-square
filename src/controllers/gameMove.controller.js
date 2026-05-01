import gameMoveService from "../services/gameMove.service.js";
import boardService from "../services/board.service.js";
import models from "../models/index.js";

const { Game } = models;

const placeCard = async (req, res) => {
    const { gameId } = req.params;
    const { position, cardId } = req.body;
    const playerId = parseInt(req.params.id, 10);

    if (!gameId || !position || !cardId) {
        return res.status(400).json({
            error: "Missing gameId, position or cardId"
        });
    }

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({
            error: "Invalid playerId"
        });
    }

    try {
        const humanResult = await gameMoveService.placeCard(
            parseInt(gameId, 10),
            playerId,
            parseInt(position, 10),
            parseInt(cardId, 10)
        );

        const game = await Game.findByPk(gameId);

        if (game.turn === game.player_2) {
            const botPlay = await gameMoveService.botMove(gameId);

            if (botPlay) {
                await gameMoveService.placeCard(
                    parseInt(gameId, 10),
                    game.player_2,
                    botPlay.position,
                    botPlay.cardId
                );
            }
        }

        const board = await boardService.getFullBoard(gameId);
        const endState = await gameMoveService.checkGameEnd(gameId);

        return res.status(200).json({
            success: true,
            game_id: gameId,
            board,
            endState
        });
    } catch (error) {
        console.error("Error placing card:", error);
        return res.status(400).json({
            error: error.message
        });
    }
};

export default {
    placeCard
};