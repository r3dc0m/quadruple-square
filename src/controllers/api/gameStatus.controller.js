import models from "../../models/index.js";
import gameMoveService from "../../services/gameMove.service.js";
import boardService from "../../services/board.service.js";
import stealCardService from "../../services/stealCard.service.js";

const { Game, GameSelectedCard, Card, Player } = models;

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

const getFullGameState = async (req, res) => {
    const { gameId } = req.params;
    const playerId = parseInt(req.params.id, 10);

    const game = await Game.findByPk(gameId, {
        include: [
            { model: Player, as: "Player1" },
            { model: Player, as: "Player2" }
        ]
    });

    if (!game || (game.player_1 !== playerId && game.player_2 !== playerId)) {
        return res.status(404).json({ error: "Game not found or access denied" });
    }

    const board = await boardService.getFullBoard(gameId);

    const player1Hand = await GameSelectedCard.findAll({
        where: {
            game_id: gameId,
            player_id: game.player_1,
            is_available: true
        },
        include: [{
            model: Card,
            attributes: [
                "card_id", "card_name", "image_path",
                "power_up", "power_right", "power_down", "power_left", "rarity"
            ]
        }]
    });

    const player2Hand = await GameSelectedCard.findAll({
        where: {
            game_id: gameId,
            player_id: game.player_2,
            is_available: true
        },
        include: [{
            model: Card,
            attributes: [
                "card_id", "card_name", "image_path",
                "power_up", "power_right", "power_down", "power_left", "rarity"
            ]
        }]
    });

    const endState = await gameMoveService.checkGameEnd(gameId);

    let stealableCards = [];
    if (game.status === 'waiting_steal' && game.winner === playerId) {
        const loserId = game.player_1 === playerId ? game.player_2 : game.player_1;
        stealableCards = await stealCardService.getStealableCards(gameId, loserId);
    }

    return res.json({
        game_id: gameId,
        game,
        board,
        player1Hand,
        player2Hand,
        endState,
        stealableCards,
        playerId,
        p1Count: endState.p1Count || board.filter(slot => slot.owner_id === game.player_1).length,
        p2Count: endState.p2Count || board.filter(slot => slot.owner_id === game.player_2).length
    });
};

export const functions = {
    getGameStatus,
    getFullGameState
};

export default functions;