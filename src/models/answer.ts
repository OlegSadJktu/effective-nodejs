import { z } from "zod";
import { FieldTypes } from "./field.js";

export const needAnswer = [
    FieldTypes.Enum.Question,
    FieldTypes.Enum.Selection
]

export const answerSchema = z.object({
    id: z.number().nullish(),
    formId: z.number(),
    data: z.map(z.number(), z.any()) 
})

export type Answer = z.infer<typeof answerSchema>
