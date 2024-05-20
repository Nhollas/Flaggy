"use client"

import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/app/components/ui"

import {
  ContextBuilderForm,
  preloadedContextBuilderFormSchema,
} from "./useContextBuilderForm"

export function PreloadedStateInput() {
  const { control, setValue } = useFormContext<ContextBuilderForm>()

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData("text")

    const url = new URL(pastedText)

    const data = JSON.parse(url.searchParams.get("data") || "{}")
    const redirectUrl = url.searchParams.get("redirectUrl") || ""

    const valid = await preloadedContextBuilderFormSchema.parseAsync({
      contexts: data.contexts,
      redirectUrl,
    })

    const urlPathame = new URL(redirectUrl).pathname

    setValue("contexts", valid.contexts)
    setValue("redirectUrl", urlPathame)
  }

  const allowPasting = (e: React.KeyboardEvent) => {
    const isActionCTRLandV =
      (e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "V"

    if (!isActionCTRLandV) {
      e.preventDefault()
    }
  }

  return (
    <FormField
      control={control}
      name="preloadedState"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preloaded State</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Preloaded State (only pasting allowed)."
              onPaste={handlePaste}
              onKeyDown={allowPasting}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
