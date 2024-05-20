"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/app/components/ui"

export function RedirectUrlInput() {
  return (
    <FormField
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
