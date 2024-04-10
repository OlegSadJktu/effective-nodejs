import { FastifyReply, FastifyRequest } from "fastify"
import { Form } from ".."
import { db } from "../db/db"
import { keys } from "ts-transformer-keys"
// type FKeys = <T extends object>() => Array<keyof T>



function removeExtraFields<T extends object>(obj): T {
    console.log(typeof keys)
    const ikeys = keys<T>()
    const o: T = {} as T
    ikeys.map((key) => {
        if (key in obj) {
            o[key] = obj[key]
        }
    })
    return o
}

export async function getAll(req, res) {
    const forms = db.collection<Form>('forms')
    const form = await forms.find({}).toArray()
    console.log(typeof form[0].creation)

    return form
}

export async function getById(req: FastifyRequest, res: FastifyReply) {
    const { formId } = req.params as {formId: number}
    const formIdNum = +formId 
    console.log(typeof formIdNum )
    const form = await db.collection<Form>('forms').findOne({id: formIdNum})
    console.log(formId, form)
    if (form === null) {
        res.code(404).send("not found")
    }
    return res.code(200).send(form)
}

export async function createNew(req, res) {
    // const { ...form } = req.body as Form
    const form = removeExtraFields<Form>(req.body)
    form.creation = Date.now()
    const result = await db.collection<Form>('forms').insertOne(form)
    result.insertedId
    res.code(200).send(result.insertedId)
    
}
