import { FastifyReply, FastifyRequest } from "fastify"
import { db, getCount } from "../db/db.js"
import { Form, formSchema } from "../../src/models/form.js"
import { Answer } from "../../src/models/answer.js"
// type FKeys = <T extends object>() => Array<keyof T>




export async function getAll(req, res) {
    const forms = db.collection<Form>('forms')
    const form = await forms.find({}).toArray()
    if (form.length == 0) {
        res.json({})
        return
    }

    return res.json(form)
}

export async function getById(req, res) {
    const { formId } = req.params as {formId: number}
    const formIdNum = +formId 
    const form = await db.collection<Form>('forms').findOne({id: formIdNum})
    if (form === null) {
        res.status(404).send("not found")
    }
    return res.status(200).send(form)
}

export async function createNew(req, res) {
    let form: Form
    try {
        form = formSchema.parse(req.body)
        console.log(req.body)
    } catch (err) {
        console.log(req.body)
        console.log(err.message)
        res.status(500).send("invalid data")
        return
    }
    const count = await getCount('forms')
    form.creation = Date.now()
    form.id = count
    let counter = 1
    for (let field of form.fields) {
        field.id = counter 
        counter += 1
    }
    const result = await db.collection<Form>('forms').insertOne(form)
    result.insertedId
    res.status(200).send(result.insertedId)
}

export async function del(req, res) {
    const { formId } = req.params as { formId: number }
    const formIdNum = + formId
    const result = await db.collection('forms').deleteOne({id: formIdNum})
    if (result.deletedCount !== 1) {
        return res.status(404).send('Not found')
    }
    const ansResult = await db.collection<Answer>('answers').deleteMany({formId: formIdNum})
    return res.status(200).send(result.acknowledged)
}

export async function update(req, res) {
    const { formId } = req.params as {formId: number}
    const formIdNum = +formId
    const form = formSchema.parse(req.body)
    if (form.id in [undefined, null]) {
        return res.status(400).send('Empty id')
    }
    console.log(`form id: ${formIdNum}`)
    const updateResult = await db.collection<Form>('forms').updateOne(
        {id: formIdNum},
        {
            $set: form
        }
    )
    if (updateResult.modifiedCount !== 1) {
        return res.status(400).send('Form not found')
    }
    return res.status(200).send(form.id)
}