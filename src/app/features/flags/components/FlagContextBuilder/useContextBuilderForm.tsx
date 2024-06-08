"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { contextSchema } from "../../schemas"

export type ContextBuilderForm = z.infer<typeof contextBuilderFormSchema>

const contextBuilderFormSchema = z.object({
  contexts: z.array(contextSchema),
  redirectPath: z.string().min(1, { message: "Redirect Path is required" }),
  preloadedState: z.string().url().optional(),
})

export const preloadedContextBuilderFormSchema = contextBuilderFormSchema.pick({
  contexts: true,
  preloadedState: true,
})

export const useContextBuilderForm = () =>
  useForm<ContextBuilderForm>({
    resolver: zodResolver(contextBuilderFormSchema),
    defaultValues: {
      contexts: [],
      redirectPath: "/",
    },
  })
