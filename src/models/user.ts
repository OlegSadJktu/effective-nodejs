import { DataTypes, Sequelize } from "sequelize"


module.exports = (sequelize: Sequelize) => {
    sequelize.define('user', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING
        }

    })
}