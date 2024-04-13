// import {createServer} from 'node:http'

import {fastify} from 'fastify'
import { MongoClient } from "mongodb"

import { db } from './db/db'

import * as ans from './routes/answers'
import * as forms from './routes/form'
import {z} from 'zod'


const FieldTypes = z.enum(['Text', 'Selection', 'Question'])


export const needAnswer = [
    FieldTypes.Enum.Question,
    FieldTypes.Enum.Selection
]

export const fieldSchema = z.object({
    type: FieldTypes,
    id: z.number().nullish(),
})

export type Field = z.infer<typeof fieldSchema>

export const textFieldSchema = z.object({
    id: z.number().nullish(),
    type: z.literal(FieldTypes.Enum.Text),
    text: z.string(),
    // options: z.string().array().nullish(),
})

export const selectionFieldSchema = z.object({
    id: z.number().nullish(),
    type: z.literal(FieldTypes.Enum.Selection),
    text: z.string(),
    options: z.string().array(),
})

export const questionFieldSchema = z.object({
    id: z.number().nullish(),
    type: z.literal(FieldTypes.Enum.Question),
    text: z.string(),
    // options: z.string().array().nullish(),
})

export type TextField = z.infer<typeof textFieldSchema>
export type SelectionField = z.infer<typeof selectionFieldSchema>
export type QuestionField = z.infer<typeof questionFieldSchema>

const fieldUnion = z.discriminatedUnion('type', [
    textFieldSchema, selectionFieldSchema, questionFieldSchema
])

export const answerSchema = z.object({
    id: z.number().nullish(),
    formId: z.number(),
    data: z.map(z.number(), z.any()) 
})

export type Answer = z.infer<typeof answerSchema>

export const formSchema = z.object({
    id: z.number().nullish(),
    author: z.coerce.number().nullish(),
    title: z.string(),
    creation: z.number().nullish(),
    fields: fieldUnion.array(),
    // fields: z.union([textFieldSchema, selectionFieldSchema, questionFieldSchema]).transform((a) => {
    //     console.log("debug =>", a, a.type)
    //     switch (a.type) {
    //         case FieldTypes.enum.Question:
    //             return questionFieldSchema.parse(a)
    //         case FieldTypes.enum.Text:
    //             return textFieldSchema.parse(a)
    //         case FieldTypes.enum.Selection:
    //             return selectionFieldSchema.parse(a)
    //         default:
    //             throw new Error(`Type not found ${a.type}`)
    //     }
    // }).array()
})

export type Form = z.infer<typeof formSchema>



// export interface Form {
//     id: number,
//     author: number,
//     title: string,
//     creation: number,
//     fieldIdCount: number,
//     fields: Array<Field>,
// }




const PORT = 3000

const fast = fastify({
    logger: true
})
fast.setErrorHandler((er, req, res) => {
    console.log(er.message)
    res.code(500).send({
        error: "Internal error",
        message: er.message
    })

})

fast.get('/', forms.getAll)
fast.post('/forms', forms.createNew)
fast.delete('/forms/:formId', forms.del)
fast.get('/forms/:formId', forms.getById)
fast.put('/forms/:formId', forms.update)
fast.get('/forms/:formId/answers', ans.getAllByFormId)
fast.post('/forms/:formId/answers', ans.create)
fast.delete('/forms/:formId/answers/:answerId', ans.del)



try {
    fast.listen({port: PORT})
} catch (err) {
    // fastify.log.error(err)
    process.exit(1)
}

