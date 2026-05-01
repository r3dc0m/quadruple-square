import stealCardService from "../services/stealCard.service.js";
import models from "../models/index.js";

const getStealableCards = async (req, res) => {
    const { gameId } = req.params;
    const playerId = parseInt(req.params.id, 10);

    try {
        const game = await models.Game.findByPk(gameId);
        if (!game || game.status !== 'waiting_steal' || game.winner !== playerId) {
            return res.status(400).json({ error: 'No steal available' });
        }

        const loserId = game.player_1 === playerId ? game.player_2 : game.player_1;
        const stealable = await stealCardService.getStealableCards(gameId, loserId);

        res.json({
            stealable_cards: stealable.sort((a, b) => b.total_power - a.total_power)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const stealCard = async (req, res) => {
    const { gameId } = req.params;
    const { cardId } = req.body;
    const playerId = parseInt(req.params.id, 10);

    try {
        await stealCardService.stealCard(gameId, playerId, cardId);
        const game = await models.Game.findByPk(gameId);
        await game.update({ status: 'finished' });

        res.json({ success: true, message: 'Card stolen!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const functions = {
    getStealableCards,
    stealCard
};

export default functions;