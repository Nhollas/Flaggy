"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { flagContextSchema } from "../../schemas"

export type ContextBuilderForm = z.infer<typeof flagContextSchema>

export const useContextBuilderForm = () =>
  useForm<ContextBuilderForm>({
    resolver: zodResolver(flagContextSchema),
    defaultValues: {
      contexts: [],
    },
  })
