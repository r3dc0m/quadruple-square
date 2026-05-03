import gameSelectionService from "../../services/gameSelection.service.js";

const getSelection = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player id" });
    }

    try {
        const selection = await gameSelectionService.getSelection(playerId);
        const collection = await gameSelectionService.getPlayerCollection(playerId);

        return res.json({
            player_id: playerId,
            selection,
            collection
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const addCard = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    const cardId = parseInt(req.body.cardId, 10);

    if (!playerId || isNaN(playerId) || !cardId || isNaN(cardId)) {
        return res.status(400).json({ error: "Invalid ids" });
    }

    try {
        await gameSelectionService.addCard(playerId, cardId);
        const selection = await gameSelectionService.getSelection(playerId);
        return res.json({ success: true, selection });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const removeCard = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    const cardId = parseInt(req.body.cardId, 10);

    if (!playerId || isNaN(playerId) || !cardId || isNaN(cardId)) {
        return res.status(400).json({ error: "Invalid ids" });
    }

    try {
        await gameSelectionService.removeCard(playerId, cardId);
        const selection = await gameSelectionService.getSelection(playerId);
        return res.json({ success: true, selection });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const resetSelection = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player id" });
    }

    try {
        await gameSelectionService.resetSelection(playerId);
        return res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export default {
    getSelection,
    addCard,
    removeCard,
    resetSelection
};