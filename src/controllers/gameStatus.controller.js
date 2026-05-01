import models from "../models/index.js";
import gameMoveService from "../services/gameMove.service.js";
import boardService from "../services/board.service.js";

const { Game } = models;

const getGameStatus = async (req, res) => {
    const { gameId } = req.params;

    const game = await Game.findByPk(gameId);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }

    const board = await boardService.getFullBoard(gameId);
    const status = await gameMoveService.checkGameEnd(gameId);

    return res.json({
        game_id: gameId,
        status: game.status,
        winner: game.winner,
        turn: game.turn,
        board,
        gameEnd: status
    });
};

export const functions = {
    getGameStatus
};

export default functions;