import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Card = sequelize.define(
        "Card",
        {
            card_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            card_name: {
                type: DataTypes.STRING(89),
                allowNull: false
            },
            image_path: {
                type: DataTypes.STRING(89),
                allowNull: false
            },
            power_up: { type: DataTypes.INTEGER, allowNull: false },
            power_right: { type: DataTypes.INTEGER, allowNull: false },
            power_down: { type: DataTypes.INTEGER, allowNull: false },
            power_left: { type: DataTypes.INTEGER, allowNull: false },
            rarity: {
                type: DataTypes.ENUM('S', 'A', 'B', 'C', 'D'),
                allowNull: false
            },
        },
        {
            tableName: "cards",
            timestamps: false
        }
    );

    return Card;
};