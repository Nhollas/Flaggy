"use client"

import { useWatch } from "react-hook-form"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui"

import { AttributeValueInput } from "./AttributeValueInput"
import { ContextBuilderForm } from "./useContextBuilderForm"

export function AttributesTable({ index }: { index: number }) {
  const attributes =
    useWatch<ContextBuilderForm>({
      name: `contexts.${index}.attributes`,
    }) || {}

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
          <TableRow key={key}>
            <TableCell className="font-medium text-[1.05rem] max-w-[150px] truncate">
              {key}
            </TableCell>
            <TableCell>
              <AttributeValueInput index={index} attribute={key} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
