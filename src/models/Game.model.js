import { DataTypes } from "sequelize";


export default (sequelize) => {
    const Game = sequelize.define(
        "Game",
        {
            game_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            player_1: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            player_2: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            turn: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "active"
            },
            winner: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: "games",
            timestamps: false
        }
    );


    return Game;
};