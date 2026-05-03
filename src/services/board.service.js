import models from "../models/index.js";

const { GameBoard, Card } = models;

const initializeGameBoard = async (gameId) => {
    const boardPositions = Array.from({ length: 9 }, (_, position) => ({
        game_id: gameId,
        card_id: null,
        owner_id: null,
        position
    }));

    await GameBoard.destroy({ where: { game_id: gameId } });
    return await GameBoard.bulkCreate(boardPositions);
};

const getFullBoard = async (gameId) => {
    const board = await GameBoard.findAll({
        where: { game_id: gameId },
        include: [
            {
                model: Card,
                as: "Card"
            }
        ],
        order: [["position", "ASC"]]
    });

    return board;
};

const getHand = async (gameId, playerId) => {
    return GameSelectedCard.findAll({
        where: { game_id: gameId, player_id: playerId },
        include: [Card]
    });
};

export default {
    initializeGameBoard,
    getFullBoard,
    getHand
};