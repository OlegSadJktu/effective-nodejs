import { DataTypes, Sequelize } from "sequelize"

module.exports = (sequelize: Sequelize) => {
    sequelize.define('text_field', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
        }
    })
}