import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { contextBuilderFormSchema } from "../schemas"
import { ContextBuilderForm } from "../types"

export const useContextBuilderForm = () =>
  useForm<ContextBuilderForm>({
    resolver: zodResolver(contextBuilderFormSchema),
    defaultValues: {
      contexts: [],
      redirectPath: "/",
      flagSecret: "",
      baseUrl: typeof window !== "undefined" ? window.location.href : "",
    },
  })
