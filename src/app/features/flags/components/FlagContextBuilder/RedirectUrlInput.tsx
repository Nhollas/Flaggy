"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"

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
