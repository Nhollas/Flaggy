"use client"

import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/app/components/ui"

import { ContextBuilderForm } from "./useContextBuilderForm"

export function RedirectUrlInput() {
  const { control } = useFormContext<ContextBuilderForm>()

  return (
    <FormField
      control={control}
      name="redirectUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Redirect Url</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Redirect Url" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
