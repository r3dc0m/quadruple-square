import GameBoard from "../models/GameBoard.model.js";

const getGameBoardPositions = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: "gameId must be a valid number"
        });
    }

    try {
        const positions = await GameBoard.findAll({
            where: { game_id: parseInt(id, 10) }, //force decimal instead of word
            order: [["position", "ASC"]]
        });

        const fullBoard = Array.from({ length: 9 }, (_, position) => {
            const slot = positions.find((p) => p.position === position);
            return slot
                ? slot.toJSON()
                : {
                    game_id: id,
                    card_id: null,
                    owner_id: null,
                    position
                };
        });

        res.status(200).json({
            gameId,
            board: fullBoard
        });

    } catch (error) {
        console.error("Error in getGameBoardPositions:", error);
        res.status(500).json({
            error: "Error fetching game board positions"
        });
    }
};

export const functions = {
    getGameBoardPositions
};

export default functions;