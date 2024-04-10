import { Sequelize } from "sequelize"

function extraSetup(sequelize: Sequelize) {
    const { form, text_field, selection_field, question_field } = sequelize.models
    form.hasMany(text_field)
    text_field.belongsTo(form)
    form.hasMany(selection_field)
    selection_field.belongsTo(form)
    form.hasMany(question_field)
    question_field.belongsTo(form)
}