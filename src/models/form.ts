
// export class Form {
//     id: number
//     title: string
//     fields: Array<Field>
//     creation: Date
// }

import { DataTypes, Sequelize } from "sequelize";


export default (sequelize: Sequelize) => {
    sequelize.define('form', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING


        }

    });
}