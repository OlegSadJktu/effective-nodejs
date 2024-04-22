import { Answer, answerSchema, Form, needAnswer } from "../index.js";
import { db, getCount } from "../db/db.js";

export async function getAllByFormId(req, res) {
    const { formId } = req.params
    const formIdNum = +formId
    const answers = await db.collection<Answer>('answers').find({formId: formIdNum}).toArray()
    if (answers.length < 1) {
        return res.code(404).send('Not found')
    }
    return res.send(answers)
    
}

export async function create(req, res) {
    const { formId } = req.params
    const formIdNum = +formId
    const answer = answerSchema.parse(req.body)
    const form = await db.collection<Form>("forms").findOne({id: formIdNum})
    const interestedIds = Array()
    for (let field of form.fields) {
        if (field.type in needAnswer) {
            interestedIds.push(field.id)
        }
    }

    for (let key of answer.data.keys()) {
        if (!(key in interestedIds)) {
            answer.data.delete(key)
        }
    }
    if (interestedIds.length !== answer.data.size) {
        return res.code(503).send('No such anwsers')

    }
    const ansId = await getCount('answers')
    answer.id = ansId
    db.collection<Answer>('answers').insertOne(answer);
}

export async function del(req, res) {
    const { answerId } = req.params
    const answerIdNum = +answerId
    const result = await db.collection<Answer>('answers').deleteOne({id: answerIdNum})
    if (result.deletedCount < 1) {
        return res.code(404).send('Not found')
    }
    return res.code(200).send(answerIdNum)
}