import { z } from "zod"
import { fieldUnion } from "./field.js"

export const formSchema = z.object({
    id: z.number().nullish(),
    author: z.coerce.number().nullish(),
    title: z.string(),
    creation: z.number().nullish(),
    fields: fieldUnion.array(),
})

export type Form = z.infer<typeof formSchema>

