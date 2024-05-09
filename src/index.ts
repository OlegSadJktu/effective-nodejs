// import {createServer} from 'node:http'

import { MongoClient } from "mongodb"
import * as express from 'express'

import { db } from './db/db.js'

import * as ans from './routes/answers.js'
import * as form from './routes/form.js'
import swaggerJsDoc from 'swagger-jsdoc'
import { serve, setup } from "swagger-ui-express"



const PORT = 3000

const server = express.default()

server.use(express.json())

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: "1.0"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["src/index.ts", "src/routes/form.ts"]
}

const swaggerDocs = swaggerJsDoc(options)
console.log(swaggerDocs)
server.use('/docs', serve, setup(swaggerDocs))

/**
 * @openapi
 * /forms:
 *   get:
 *     description: Get all forms
 *     responses:
 *       200:
 *         description: Success
 *       400: 
 *         description: Not found
 *   post:
 *     description: Create new form
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *      
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: integer
 *               title:
 *                 type: string
 *               fields:
 *                 type: array
 *      
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: 
 *                       type: string
 *                     type: 
 *                       type: string
 *                       enum: 
 *                         - Question
 *                         - Selection
 *                         - Text
 *          
 *                     text:
 *                       type: string
 *          
 *     responses:
 *       200: 
 *         description: Success create
 * /forms/{formId}:
 *   delete:
 *     description: Delete form by id
 *     parameters:
 *     - name: formId
 *       description: Form id
 *       in: path
 *       required: true
 *       type: number
 *     responses:
 *       200:
 *         description: Success
 *       400: 
 *         description: Not found
 *   put:
 *     description: Create new form
 *     requestBody:
 *       content:
 *         application/json:
 *      
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: integer
 *               title:
 *                 type: string
 *               fields:
 *                 type: array
 *      
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: 
 *                       type: string
 *                     type: 
 *                       type: string
 *                       enum: 
 *                         - Question
 *                         - Selection
 *                         - Text
 *          
 *                     text:
 *                       type: string
 *     parameters:
 *     - name: formId 
 *       in: path
 *       description: Form id
 *       required: true
 *       type: integer
 *     responses:
 *       200: 
 *         description: Success create
 */
server.get('/forms', form.getAll)
server.post('/forms', form.createNew)
server.delete('/forms/:formId', form.del)
server.get('/forms/:formId', form.getById)
server.put('/forms/:formId', form.update)
/**
 * @swagger
 * components:
 *   schemas: 
 *     AnswerModel: 
 *       data:
 *         type: object
 *         additionalProperties: 
 *           type: integer
 * /forms/{formId}/answers:
 *   get:
 *     description: Get all answers by form
 *     parameters:
 *     - name: formId
 *       required: true
 *       in: path
 *       type: integer
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     description: Create new answer 
 *     parameters:
 *     - name: formId
 *       required: true
 *       in: body
 *       type: integer
 *     - name: data
 *       required: true
 *       type: object
 *       in: body
 *       additionalProperties: 
 *         type: integer
 *     - name: formId
 *       required: false
 *       in: path
 *       type: integer
 *     responses:
 *       200:
 *         description: Success
 * /forms/{formId}/answers/{answerId}:
 *   delete:
 *     description: Delete answer by answerId
 *     parameters:
 *     - name: answerId
 *       required: true
 *       in: path
 *       type: integer
 *     - name: formId
 *       required: true
 *       in: path
 *       type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400: 
 *         description: Answer not found
 *     
 *       
 */
server.get('/forms/:formId/answers', ans.getAllByFormId)
server.post('/forms/:formId/answers', ans.create)
server.delete('/forms/:formId/answers/:answerId', ans.del)


server.use((err, req, res, next) => {
    console.error(err.message, err.stack)
    res.status(500).send("Internal error")
})

try {
    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    })
} catch (err) {
    // fastify.log.error(err)
    process.exit(1)
}

