"use client"

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

import { useAttributes } from "../hooks"

export const AttributesTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="px-0 py-2">Attribute</TableHead>
      <TableHead className="px-0 py-2 text-right">Value</TableHead>
    </TableRow>
  </TableHeader>
)

export const AttributeInputTableCell = ({
  attribute,
  contextIndex,
}: {
  attribute: string
  contextIndex: number
}) => {
  return (
    <TableCell className="px-0">
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
  )
}

export const AttributeTableCell = ({ attribute }: { attribute: string }) => (
  <TableCell className="max-w-[150px] truncate px-0 text-[1.05rem] font-medium">
    {attribute}
  </TableCell>
)

export const AttributesTable = ({ contextIndex }: { contextIndex: number }) => {
  const attributes = useAttributes(contextIndex)

  return (
    <Table>
      <AttributesTableHeader />
      <TableBody>
        {Object.entries(attributes).map(([attribute]) => (
          <TableRow key={attribute}>
            <AttributeTableCell attribute={attribute} />
            <AttributeInputTableCell
              attribute={attribute}
              contextIndex={contextIndex}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
