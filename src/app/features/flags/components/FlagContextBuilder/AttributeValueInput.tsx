"use client"

import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/app/components/ui"

import { ContextBuilderForm } from "./useContextBuilderForm"

export function AttributeValueInput({
  index,
  attribute,
}: {
  index: number
  attribute: string
}) {
  const { control } = useFormContext<ContextBuilderForm>()

  return (
    <FormField
      control={control}
      name={`contexts.${index}.attributes.${attribute}`}
      render={({ field }) => (
        <FormItem>
          <FormControl className="ml-auto">
            <Input
              {...field}
              placeholder="Value"
              className="w-[200px] bg-white"
            />
          </FormControl>
          <FormMessage className="text-right" />
        </FormItem>
      )}
    />
  )
}