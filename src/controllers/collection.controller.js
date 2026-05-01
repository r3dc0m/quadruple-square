import collectionService from "../services/collection.service.js";

const getCollection = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player id" });
    }

    try {
        const collection = await collectionService.getPlayerCollection(playerId);
        return res.json({ player_id: playerId, collection });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAvailableCollection = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player id" });
    }

    try {
        const collection = await collectionService.getAvailableCollection(playerId);
        return res.json({ player_id: playerId, collection });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default {
    getCollection,
    getAvailableCollection
};