import gameService from "../../services/game.service.js";
import boardService from "../../services/board.service.js";

const createGame = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    const botId = parseInt(req.body.botId, 10);

    if (!botId || isNaN(botId)) {
        return res.status(400).json({ error: "Invalid botId" });
    }

    try {
        const selected = await gameService.getSelection(playerId);
        const playerCards = selected.map((row) => row.card_id);

        const game = await gameService.createGame(playerId, botId, playerCards);
        const fullBoard = await boardService.getFullBoard(game.game_id);

        res.status(201).json({
            game_id: game.game_id,
            board: fullBoard,
            players: {
                human: { player_id: playerId },
                bot: { player_id: botId },
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const cancelActiveGame = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);

    try {
        const cancelledGame = await gameService.cancelGameByPlayer(playerId);

        if (!cancelledGame) {
            return res.redirect(`/players/${playerId}/newgame`);
        }
        res.redirect(`/players/${playerId}/newgame`);
    } catch (error) {
        console.error(error.message);
        res.redirect(`/players/${playerId}/newgame`);
    }
};



export default {
    createGame,
    cancelActiveGame
};