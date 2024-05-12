import { z } from "zod"

import { stringToJSON } from "@/app/lib/schemas"

/**
  @example
  {
    kind: "user",
    attributes: {
      key: "nick",
      email: "nick@gmail.com"
      phone: "123456789"
    }
  }
 */

export const contextSchema = z.object({
  kind: z.string().min(1, { message: "Property 'kind' cannot be empty." }),
  attributes: z
    .object({
      key: z
        .string()
        .min(1, { message: "Required attribute 'key' cannot be empty." }),
    })
    .and(z.record(z.string())),
})

export const stringToJSONSchema = stringToJSON()

export const flagContextSchema = z
  .object({
    contexts: z.array(contextSchema),
  })
  .strict()

export const getFlagContextRequestSchema =
  stringToJSONSchema.pipe(flagContextSchema)
