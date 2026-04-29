import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Bot = sequelize.define(
        "Bot",
        {
            bot_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            bot_name: {
                type: DataTypes.STRING(89),
                allowNull: false
            },
        },
        {
            tableName: "bots",
            timestamps: false
        }
    );

    return Bot;
};