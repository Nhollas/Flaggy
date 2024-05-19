"use client"

import { memo } from "react"

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

function AttributesTable({
  index,
  attributes,
}: {
  index: number
  attributes: Attributes
}) {
  // console.log("Rendering AttributesTable", { index, attributes })
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
          <TestRow key={key} index={index} attribute={key} />
        ))}
      </TableBody>
    </Table>
  )
}

export default memo(AttributesTable)

function TestRow({ attribute, index }: { attribute: string; index: number }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-[1.05rem] max-w-[150px] truncate">
        {attribute}
      </TableCell>
      <TableCell>
        <AttributeValueInput index={index} attribute={attribute} />
      </TableCell>
    </TableRow>
  )
}
