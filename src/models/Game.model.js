import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Game = sequelize.define(
        "Game",
        {
            game_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            bot_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        },
        {
            tableName: "games",
            timestamps: false
        }
    );

    return Game;
};