"use client"

import { useFormContext } from "react-hook-form"

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

import { ContextBuilderForm } from "./useContextBuilderForm"

const AttributesTable = ({ contextIndex }: { contextIndex: number }) => {
  const { watch } = useFormContext<ContextBuilderForm>()
  const attributes = watch(`contexts.${contextIndex}.attributes`)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Attribute</TableHead>
          <TableHead className="text-right">Value</TableHead>
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

const AttributeRow = ({
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
)
