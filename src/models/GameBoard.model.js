import { DataTypes } from "sequelize";

export default (sequelize) => {
    const GameBoard = sequelize.define(
        "GameBoard",
        {
            game_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            card_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            owner_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            tableName: "game_board",
            timestamps: false
        }
    );

    GameBoard.removeAttribute('id');

    return GameBoard;
};