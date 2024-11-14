import { z } from "zod"

import { stringToJSON } from "@/app/lib/schemas"

export const contextSchema = z
  .object({
    kind: z.string().min(1, { message: "Property 'kind' cannot be empty." }),
    attributes: z
      .object({
        key: z
          .string()
          .min(1, { message: "Required attribute 'key' cannot be empty." }),
      })
      .and(z.record(z.string())),
  })
  .strict()

export const stringToJSONSchema = stringToJSON()

export const flagContextSchema = z
  .object({
    contexts: z.array(contextSchema),
  })
  .strict()

export const getFlagContextRequestSchema =
  stringToJSONSchema.pipe(flagContextSchema)

export const contextBuilderFormSchema = z.object({
  contexts: z.array(contextSchema),
  redirectPath: z.string().min(1, { message: "Redirect Path is required" }),
  flagSecret: z.string().min(1, { message: "Flag Secret is required" }),
  preloadedState: z.string().url().optional(),
})

export const preloadedContextBuilderFormSchema = contextBuilderFormSchema.pick({
  contexts: true,
  preloadedState: true,
})
