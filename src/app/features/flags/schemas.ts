import { z } from "zod"

import { stringToJSON } from "@/app/lib/schemas"

/**
  @example
  {
    contextKind: "user",
    contextKey: "nick",
    attributes: {
      email: "",
      phone: "",
    }
  }
 */

export const contextSchema = z.object({
  contextKind: z.string().min(1, { message: "ContextKind cannot be empty." }),
  contextKey: z.string().min(1, { message: "ContextKey cannot be empty." }),
  attributes: z.record(z.string()),
})

export const stringToJSONSchema = stringToJSON()

export const flagContextSchema = z
  .object({
    contexts: z.array(contextSchema),
  })
  .strict()

export const getFlagContextRequestSchema =
  stringToJSONSchema.pipe(flagContextSchema)
