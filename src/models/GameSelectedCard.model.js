import { DataTypes } from "sequelize";

export default (sequelize) => {
    const GameSelectedCard = sequelize.define(
        "GameSelectedCard",
        {
            game_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            player_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            card_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            tableName: "game_selected_cards",
            timestamps: false
        }
    );
    
    GameSelectedCard.removeAttribute('id');

    return GameSelectedCard;
};