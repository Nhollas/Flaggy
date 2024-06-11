"use client"

import { useFormContext } from "react-hook-form"
import { z } from "zod"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/app/components/ui"

import { preloadedContextBuilderFormSchema } from "../../schemas"
import { ContextBuilderForm } from "../../types"

export function PreloadedStateInput() {
  const { setValue, setError, control } = useFormContext<ContextBuilderForm>()

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData("text")

    const isValidUrl = await z.string().url().safeParseAsync(pastedText)

    if (!isValidUrl.success) {
      setError("preloadedState", {
        type: "invalidUrl",
        message: "Invalid URL",
      })
      return
    }

    const url = new URL(isValidUrl.data)

    const data = JSON.parse(url.searchParams.get("data") || "{}")
    const redirectUrl = url.searchParams.get("redirectUrl") || ""

    const { contexts } = await preloadedContextBuilderFormSchema.parseAsync({
      contexts: data.contexts,
      redirectUrl,
    })

    const urlPathame = new URL(redirectUrl).pathname
    setValue("contexts", contexts)
    setValue("redirectPath", urlPathame)
  }

  const allowOperations = (e: React.KeyboardEvent) => {
    const isPasteAction =
      (e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "V"
    const isSelectAllAction =
      (e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "A"
    const isDeleteAction =
      e.key.toUpperCase() === "DELETE" || e.key.toUpperCase() === "BACKSPACE"

    if (!isPasteAction && !isSelectAllAction && !isDeleteAction) {
      e.preventDefault()
    }
  }

  return (
    <FormField
      control={control}
      name="preloadedState"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preload State With Url</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Preload State With Url (only pasting allowed)."
              onPaste={handlePaste}
              onKeyDown={allowOperations}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
