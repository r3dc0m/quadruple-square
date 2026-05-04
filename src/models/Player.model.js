import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Player = sequelize.define(
        "Player",
        {
            player_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            player_name: {
                type: DataTypes.STRING(89),
                allowNull: false
            },
            is_bot: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            tableName: "players",
            timestamps: false
        }
    );

    return Player;
};