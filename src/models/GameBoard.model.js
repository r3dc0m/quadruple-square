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
                allowNull: true
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 8
                }
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