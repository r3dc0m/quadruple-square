import gameService from "../../services/game.service.js";
import boardService from "../../services/board.service.js";
import gameMoveService from "../../services/gameMove.service.js";
import gameSelectionService from "../../services/gameSelection.service.js";
import models from "../../models/index.js";

import handleError from "../../utils/errorHandler.js";
import logControllerEntry from "../../utils/controllerLogger.js";

const { Player, Game, GameSelectedCard, Card } = models;

const getNewGame = async (req, res) => {
    logControllerEntry('getNewGame', 'game');
    const playerId = parseInt(req.params.id, 10);

    try {
        const activeGame = await gameService.getActiveGameByPlayer(playerId);
        const bots = await models.Player.findAll({ where: { is_bot: true } });
        const collection = await gameSelectionService.getPlayerCollection(playerId);
        const draftGame = await Game.findOne({ where: { player_1: playerId, status: 'draft' } });
        const selection = draftGame ?
            await GameSelectedCard.findAll({
                where: { game_id: draftGame.game_id },
                include: [models.Card]
            }) : [];

        const selectedCards = Array(5).fill(null);
        selection.slice(0, 5).forEach((card, i) => selectedCards[i] = card);

        res.render("layout", {
            pageTitle: "New Game",
            currentPage: "newgame",
            contentView: "new-game",
            playerId,
            activeGame,
            bots,
            selectedCards,
            collectionCards: collection
        });
    } catch (error) {
        handleError(res, playerId, error, "New Game Error");
    }
};

const getGamePage = async (req, res) => {
    logControllerEntry('getGamePage', 'game');
    const playerId = parseInt(req.params.id, 10);
    const gameId = parseInt(req.params.gameId, 10);

    try {
        const game = await Game.findByPk(gameId, {
            include: [
                { model: Player, as: "Player1" },
                { model: Player, as: "Player2" }
            ]
        });

        if (!game || (game.player_1 !== playerId && game.player_2 !== playerId)) {
            return handleError(res, playerId, new Error("Game not found or access denied."),
                "Game Not Found", "new-game-error", 404);
        }

        const board = await boardService.getFullBoard(gameId);
        const player1Hand = await GameSelectedCard.findAll({
            where: { game_id: gameId, player_id: playerId },
            include: [Card]
        });
        const player2Hand = await GameSelectedCard.findAll({
            where: { game_id: gameId, player_id: game.player_2 },
            include: [Card]
        });
        const endState = await gameMoveService.checkGameEnd(gameId);

        res.render("layout", {
            pageTitle: `Game ${gameId}`,
            currentPage: "game",
            contentView: "game-board",
            playerId,
            gameId,
            game,
            board,
            player1Hand,
            player2Hand,
            endState
        });
    } catch (error) {
        handleError(res, playerId, error, "Game Error");
    }
};

const addCardToSelection = async (req, res) => {
    logControllerEntry('addCardToSelection', 'game');
    const playerId = parseInt(req.params.id, 10);
    const cardId = parseInt(req.params.cardId, 10);

    try {
        await gameSelectionService.addCard(playerId, cardId);
        res.redirect(`/players/${playerId}/newgame`);
    } catch (error) {
        handleError(res, playerId, error);
    }
};

const removeCardFromSelection = async (req, res) => {
    logControllerEntry('removeCardFromSelection', 'game');
    const playerId = parseInt(req.params.id, 10);
    const cardId = parseInt(req.params.cardId, 10);

    try {
        await gameSelectionService.removeCard(playerId, cardId);
        res.redirect(`/players/${playerId}/newgame`);
    } catch (error) {
        handleError(res, playerId, error);
    }
};

const commitGame = async (req, res) => {
    logControllerEntry('commitGame', 'game');
    const playerId = parseInt(req.params.id, 10);
    const { botId } = req.body;

    try {
        const draftGame = await Game.findOne({
            where: { player_1: playerId, status: 'draft' }
        });

        if (!draftGame) throw new Error("No draft found");

        const playerCards = await GameSelectedCard.findAll({
            where: { game_id: draftGame.game_id },
            attributes: ['card_id']
        });

        if (playerCards.length !== 5) throw new Error("Exactly 5 cards required");

        const botCards = await gameSelectionService.selectBotCards(parseInt(botId));
        await gameSelectionService.reserveBotCards(draftGame.game_id, parseInt(botId), botCards);
        await boardService.initializeGameBoard(draftGame.game_id);

        await draftGame.update({
            player_2: parseInt(botId),
            status: 'active'
        });

        res.redirect(`/players/${playerId}/game/${draftGame.game_id}`);
    } catch (error) {
        handleError(res, playerId, error);
    }
};

const cancelGameByPlayer = async (req, res) => {
    logControllerEntry('cancelGameByPlayer', 'game');
    const playerId = parseInt(req.params.id, 10);
    const gameId = parseInt(req.params.gameId, 10);

    try {
        await gameService.cancelGameByPlayer(playerId, gameId);
        return res.redirect(`/players/${playerId}/newgame`);
    } catch (error) {
        handleError(res, playerId, error, "Cancel Game Error");
    }
};

export default {
    getNewGame,
    getGamePage,
    addCardToSelection,
    removeCardFromSelection,
    commitGame,
    cancelGameByPlayer
};