// import {createServer} from 'node:http'

import {fastify} from 'fastify'
import { MongoClient } from "mongodb"

import { db } from './db/db.js'

import * as ans from './routes/answers.js'
import * as form from './routes/form.js'
import {number, z} from 'zod'
import * as swagger from '@fastify/swagger'
import * as swaggerUi from '@fastify/swagger-ui'


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
})

export type Form = z.infer<typeof formSchema>



const PORT = 3000

const fast = fastify({
    logger: true
})

await fast.register(swagger.default, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Test swagger',
            description: 'Testing the Fastify swagger API',
            version: '0.1.0'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        tags: [
            { name: 'user', description: 'User related end-points' },
            { name: 'code', description: 'Code related end-points' }
        ],
        components: {
            securitySchemes: {
                apiKey: {
                type: 'apiKey',
                name: 'apiKey',
                in: 'header'
                }
            }
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        }
    }

    
})

await fast.register(swaggerUi.default, {
    routePrefix: '/documentation'
})

fast.setErrorHandler((er, req, res) => {
    console.log(er.message)
    res.code(500).send({
        error: "Internal error",
        message: er.message
    })

})

fast.get('/forms', {
    schema: {
        description: 'Get all forms',
        params: {},
        response: {
            200: {
                type: 'array',
                items: {
                    author: {type: 'number'},
                    creation: {type: 'number'},
                    fields : {
                        type: 'array',
                        items: {
                            id: {type: 'number'},
                            options: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            },
                            text: {type:'string'},
                            type: {type: 'string'}
                        }
                    }
                }
            },
            default: {
                description: "Error",
                properties: {
                }
            }
        }
    }
}, form.getAll)
fast.post('/forms', {
    schema: {
        description: 'Create form',
        body: {
            type: 'object',
            properties: {
                author: {
                    type: 'number',
                    description: 'Creator ID'
                },
                title: {
                    type: 'string',
                    description: 'Form title'
                }
            }
        }
    }
}, form.createNew)
fast.delete('/forms/:formId', {
    schema: {
        description: 'Delete form by ID',
        params: {
            type: 'object',
            properties: {
                formId: {
                    type: 'number',
                    description: 'Form ID'
                }
            }
        },
        response: {
            200: {
                description: 'Successful response',
                properties: {
                    formId: { type: 'number' }
                }
            },
            default: {
                description: "Error",
                properties: {
                    error: {type: 'string'}
                }
            }
        }
    }
}, form.del)
fast.get('/forms/:formId', form.getById)
fast.put('/forms/:formId', {
    schema: {
        description: 'Update form. The same parameters as in the POST request'
    }
}, form.update)
fast.get('/forms/:formId/answers', ans.getAllByFormId)
fast.post('/forms/:formId/answers', ans.create)
fast.delete('/forms/:formId/answers/:answerId', ans.del)



try {
    fast.listen({port: PORT})
} catch (err) {
    // fastify.log.error(err)
    process.exit(1)
}

