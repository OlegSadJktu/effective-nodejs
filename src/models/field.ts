import { z } from "zod"

export const FieldTypes = z.enum(['Text', 'Selection', 'Question'])


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

export const fieldUnion = z.discriminatedUnion('type', [
    textFieldSchema, selectionFieldSchema, questionFieldSchema
])


export type TextField = z.infer<typeof textFieldSchema>
export type SelectionField = z.infer<typeof selectionFieldSchema>
export type QuestionField = z.infer<typeof questionFieldSchema>