import { z } from "zod"

import {
  contextBuilderFormSchema,
  contextSchema,
  flagContextSchema,
} from "./schemas"

export type FlagContext = z.infer<typeof flagContextSchema>
export type Context = z.infer<typeof contextSchema>
export type Attributes = z.infer<(typeof contextSchema)["shape"]["attributes"]>
export type ContextBuilderForm = z.infer<typeof contextBuilderFormSchema>
