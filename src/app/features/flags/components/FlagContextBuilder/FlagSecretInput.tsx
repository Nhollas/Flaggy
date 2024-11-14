"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/app/components/ui"

export function FlagSecretInput() {
  return (
    <FormField
      name="flagSecret"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Flag Secret</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Flag Secret" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
