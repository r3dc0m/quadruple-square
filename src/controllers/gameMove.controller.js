import gameMoveService from "../services/gameMove.service.js";

const placeCard = async (req, res) => {
    const { gameId } = req.params;
    const { position, cardId } = req.body;
    const playerId = parseInt(req.params.id, 10);

    try {
        const board = await gameMoveService.placeCard(
            parseInt(gameId), 
            playerId, 
            parseInt(position), 
            parseInt(cardId)
        );

        res.status(200).json({
            success: true,
            game_id: gameId,
            board
        });
    } catch (error) {
        console.error("Error placing card:", error);
        res.status(400).json({ error: error.message });
    }
};

export const functions = {
    placeCard
};

export default functions;