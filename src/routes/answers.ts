import { InsertOneResult } from "mongodb";
import { Answer, answerSchema, needAnswer } from "../../src/models/answer.js";
import { db, getCount } from "../db/db.js";
import { Form, formSchema } from "../models/form.js";

export async function getAllByFormId(req, res) {
    const { formId } = req.params
    const formIdNum = +formId
    const answers = await db.collection<Answer>('answers').find({formId: formIdNum}).toArray()
    if (answers.length < 1) {
        return res.status(404).send('Not found')
    }
    return res.json(answers)
    
}

export async function create(req, res) {
    const { formId } = req.params
    const formIdNum = +formId
    let answer: Answer
    try {
        answer = answerSchema.parse(req.body)
    } catch (err) {
        console.log(req.body)
        console.log(err.message)
        res.status(500).send("invalid data")
        return
    }
    const form = await db.collection<Form>("forms").findOne({id: formIdNum})
    const interestedIds = Array()
    console.log(needAnswer)
    for (let field of form.fields) {
        if (field.type === "Selection" || field.type == "Question") {
            interestedIds.push(field.id)
        }
    }

    let counter = 0
    for (let ans of answer.data) {
        if (!(ans.id in interestedIds)) {
            answer.data.splice(counter, 1)
        }
        counter += 1
    }
    if (interestedIds.length !== answer.data.length) {
        console.log(interestedIds)
        console.log(answer.data)
        return res.status(503).send('No such anwsers')

    }
    const ansId = await getCount('answers')
    answer.id = ansId
    const result = await db.collection<Answer>('answers').insertOne(answer);
    return res.status(201).send(result.insertedId)
}

export async function del(req, res) {
    const { answerId } = req.params
    const answerIdNum = +answerId
    const result = await db.collection<Answer>('answers').deleteOne({id: answerIdNum})
    if (result.deletedCount < 1) {
        return res.status(404).send('Not found')
    }
    return res.sendStatus(200).send(result.deletedCount)
}