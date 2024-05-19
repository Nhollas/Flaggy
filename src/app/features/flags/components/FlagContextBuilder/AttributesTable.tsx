"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui"

import { Attributes } from "../../types"

import AttributeValueInput from "./AttributeValueInput"

export function AttributesTable({
  index,
  attributes,
}: {
  index: number
  attributes: Attributes
}) {
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
              {/* <AttributeValueInput index={index} attribute={key} /> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
