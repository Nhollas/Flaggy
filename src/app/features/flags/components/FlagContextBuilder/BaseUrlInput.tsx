"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/app/components/ui"

export function BaseUrlInput() {
  return (
    <FormField
      name="baseUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Base Url</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Base Url" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
