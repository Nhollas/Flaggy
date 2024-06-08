"use client"

import { memo } from "react"
import { useWatch } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui"

import { Attributes } from "../../types"

import { ContextBuilderForm } from "./useContextBuilderForm"

const AttributesTable = ({ contextIndex }: { contextIndex: number }) => {
  const attributes = useWatch<ContextBuilderForm>({
    name: `contexts.${contextIndex}.attributes`,
  }) as Attributes

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-0 py-2">Attribute</TableHead>
          <TableHead className="px-0 py-2 text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(attributes).map(([key]) => (
          <AttributeRow key={key} attribute={key} contextIndex={contextIndex} />
        ))}
      </TableBody>
    </Table>
  )
}

export default AttributesTable

const AttributeRow = memo(
  ({
    attribute,
    contextIndex,
  }: {
    attribute: string
    contextIndex: number
  }) => (
    <TableRow>
      <TableCell className="max-w-[150px] truncate text-[1.05rem] font-medium">
        {attribute}
      </TableCell>
      <TableCell>
        <FormField<Record<string, string>>
          name={`contexts.${contextIndex}.attributes.${attribute}`}
          render={({ field }) => (
            <FormItem>
              <FormControl className="ml-auto">
                <Input {...field} placeholder="Value" className="w-[200px]" />
              </FormControl>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
      </TableCell>
    </TableRow>
  ),
)

AttributeRow.displayName = "AttributeRow"
