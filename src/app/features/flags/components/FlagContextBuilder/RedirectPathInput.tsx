"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/app/components/ui"

export function RedirectPathInput() {
  return (
    <FormField
      name="redirectPath"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Redirect Path</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Redirect Path" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
