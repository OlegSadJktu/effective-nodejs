import { FastifyReply, FastifyRequest } from "fastify"
import { Answer, Form, formSchema } from "../index.js"
import { db, getCount } from "../db/db.js"
// type FKeys = <T extends object>() => Array<keyof T>




export async function getAll(req, res) {
    const forms = db.collection<Form>('forms')
    const form = await forms.find({}).toArray()
    console.log(typeof form[0].creation)

    return form
}

export async function getById(req: FastifyRequest, res: FastifyReply) {
    const { formId } = req.params as {formId: number}
    const formIdNum = +formId 
    const form = await db.collection<Form>('forms').findOne({id: formIdNum})
    if (form === null) {
        res.code(404).send("not found")
    }
    return res.code(200).send(form)
}

export async function createNew(req, res) {
    const form = formSchema.parse(req.body)
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
    res.code(200).send(result.insertedId)
}

export async function del(req, res) {
    const { formId } = req.params as { formId: number }
    const formIdNum = + formId
    const result = await db.collection('forms').deleteOne({id: formIdNum})
    if (result.deletedCount !== 1) {
        return res.code(404).send('Not found')
    }
    const ansResult = await db.collection<Answer>('answers').deleteMany({formId: formIdNum})
    return res.code(200).send(result.acknowledged)
}

export async function update(req, res) {
    const { formId } = req.params as {formId: number}
    const formIdNum = +formId
    const form = formSchema.parse(req.body)
    if (form.id in [undefined, null]) {
        return res.code(400).send('Empty id')
    }
    const updateResult = await db.collection<Form>('forms').updateOne(
        {id: form.id},
        {
            $set: form
        }
    )
    if (updateResult.modifiedCount !== 1) {
        return res.code(400).send('Form not found')
    }
    return res.code(200).send(form.id)
}