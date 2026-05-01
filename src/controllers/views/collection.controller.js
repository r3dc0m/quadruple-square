import collectionService from "../../services/collection.service.js";

const getCollectionPage = async (req, res) => {
    const playerId = parseInt(req.params.id, 10);

    if (!playerId || isNaN(playerId)) {
        return res.status(400).render("layout", {
            pageTitle: "Collection",
            currentPage: "collection",
            contentView: "collection-empty",
            playerId,
            collection: []
        });
    }

    try {
        const collection = await collectionService.getPlayerCollection(playerId);

        return res.render("layout", {
            pageTitle: "Collection",
            currentPage: "collection",
            contentView: "collection",
            playerId,
            collection
        });
    } catch (error) {
        return res.status(500).render("layout", {
            pageTitle: "Collection",
            currentPage: "collection",
            contentView: "collection-error",
            playerId,
            collection: [],
            error: error.message
        });
    }
};

export default {
    getCollectionPage
};