import gameMoveService from "../../services/gameMove.service.js";
import boardService from "../../services/board.service.js";
import models from "../../models/index.js";

const { Game } = models;

const placeCard = async (req, res) => {
    const gameId = parseInt(req.params.gameId, 10);
    const { position, cardId } = req.body;

    const game = await Game.findByPk(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const playerId = game.player_1;

    try {
        await gameMoveService.placeCard(gameId, playerId, parseInt(position), parseInt(cardId));
        const updatedGame = await Game.findByPk(gameId);

        if (updatedGame.turn === updatedGame.player_2) {
            const botPlay = await gameMoveService.botMove(gameId);
            if (botPlay) {
                await gameMoveService.placeCard(gameId, updatedGame.player_2, botPlay.position, botPlay.cardId);
            }
        }

        const board = await boardService.getFullBoard(gameId);
        const endState = await gameMoveService.checkGameEnd(gameId);

        res.json({ success: true, game_id: gameId, board, endState });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default {
    placeCard
};