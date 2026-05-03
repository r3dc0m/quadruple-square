import models from "../models/index.js";
import { Op } from "sequelize";

const { PlayerCard, Card } = models;

const getPlayerCollection = async (playerId) => {
    return PlayerCard.findAll({
        where: { player_id: playerId },
        attributes: ["player_id", "card_id", "amount"],
        include: [{
            model: Card,
            attributes: [
                "card_id",
                "card_name",
                "image_path",
                "power_up",
                "power_right",
                "power_down",
                "power_left",
                "rarity"
            ]
        }],
        order: [["card_id", "ASC"]]
    });
};

const getAvailableCollection = async (playerId) => {
    return PlayerCard.findAll({
        where: { player_id: playerId, amount: { [Op.gt]: 0 } },
        attributes: ["player_id", "card_id", "amount"],
        include: [{
            model: Card,
            attributes: [
                "card_id",
                "card_name",
                "image_path",
                "power_up",
                "power_right",
                "power_down",
                "power_left",
                "rarity"
            ]
        }],
        order: [["card_id", "ASC"]]
    });
};

export default {
    getPlayerCollection,
    getAvailableCollection
};