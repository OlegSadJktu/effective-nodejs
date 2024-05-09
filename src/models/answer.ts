import { z } from "zod";
import { FieldTypes } from "./field.js";

export const needAnswer = [
    "Question",
    "Selection"
]

export const answerSchema = z.object({
    id: z.number().nullish(),
    formId: z.number(),
    data: z.array(
        z.object({
            id: z.number(),
            ans: z.any(),
        })
    )
})

export type Answer = z.infer<typeof answerSchema>
