"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { contextSchema } from "../../schemas"

export type ContextBuilderForm = z.infer<typeof contextBuilderFormSchema>
const contextBuilderFormSchema = z.object({
  contexts: z.array(contextSchema),
})

export const useContextBuilderForm = () =>
  useForm<ContextBuilderForm>({
    resolver: zodResolver(contextBuilderFormSchema),
    defaultValues: {
      contexts: [],
    },
  })
