// import {createServer} from 'node:http'

import {fastify} from 'fastify'
import { MongoClient } from "mongodb"

import { db } from './db/db'

import * as ans from './routes/answers'
import * as forms from './routes/form'

export interface Field {
    id: number,
    order: number
}

export interface TextField extends Field {
    text: string,
}
export interface SelectionField extends Field {
    text: string,
    options: Array<string>
}
export interface QuestionField extends Field {
    text: string,
}


export interface Form {
    id: number,
    author: number,
    title: string,
    creation: number,
    fieldIdCount: number,
    fields: Array<Field>,
}




const PORT = 3000

const fast = fastify({
    logger: true
})

fast.get('/', forms.getAll)

fast.get('/forms/:formId', forms.getById)

fast.post('/forms', forms.createNew)



try {
    fast.listen({port: PORT})
} catch (err) {
    // fastify.log.error(err)
    process.exit(1)
}

