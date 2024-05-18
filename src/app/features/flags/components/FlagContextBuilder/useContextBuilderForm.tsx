"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { contextSchema } from "../../schemas"

export type ContextBuilderForm = z.infer<typeof contextBuilderFormSchema>

const contextBuilderFormSchema = z.object({
  contexts: z.array(contextSchema),
  redirectUrl: z.string().min(1, { message: "Redirect URL is required" }),
  preloadedState: z.string().optional(),
})

export const preloadedContextBuilderFormSchema = contextBuilderFormSchema.pick({
  contexts: true,
  redirectUrl: true,
})

export const useContextBuilderForm = () =>
  useForm<ContextBuilderForm>({
    resolver: zodResolver(contextBuilderFormSchema),
    defaultValues: {
      contexts: [],
      redirectUrl: "/",
    },
  })
