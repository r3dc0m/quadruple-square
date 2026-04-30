import { DataTypes } from "sequelize";

export default (sequelize) => {
    const PlayerCard = sequelize.define(
        "PlayerCard",
        {
            player_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            card_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
        },
        {
            tableName: "player_cards",
            timestamps: false
        }
    );

    PlayerCard.removeAttribute('id');

    return PlayerCard;
};