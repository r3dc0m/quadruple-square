import { DataTypes } from "sequelize";

export default (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            user_name: {
                type: DataTypes.STRING(89),
                allowNull: false
            },
            user_email: {
                type: DataTypes.STRING(144),
                allowNull: false,
                unique: true
            },
            user_password: {
                type: DataTypes.STRING(144),
                allowNull: false
            },
            user_currency: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            when_created: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        },
        {
            tableName: "users",
            timestamps: false
        }
    );

    return User;
};