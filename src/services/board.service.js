import models from "../models/index.js";

const { GameBoard } = models;

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
    const positions = await GameBoard.findAll({
        where: { game_id: gameId },
        order: [["position", "ASC"]]
    });

    return Array.from({ length: 9 }, (_, position) => {
        const slot = positions.find((p) => p.position === position);
        return slot
            ? slot.toJSON()
            : {
                  game_id: gameId,
                  card_id: null,
                  owner_id: null,
                  position
              };
    });
};

export default {
    initializeGameBoard,
    getFullBoard
};