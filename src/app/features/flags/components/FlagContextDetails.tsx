import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/ui"

import { FlagContext } from "../types"

import { AttributeTableCell, AttributesTableHeader } from "./AttributesTable"
import { ClearContextButton } from "./ClearContextButton"

export function FlagContextDetails({
  flagContext,
}: {
  flagContext: FlagContext
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="fixed inset-x-0 bottom-0 m-4 h-12 max-w-[592px] sm:m-6 sm:mx-auto"
        >
          View Context
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-11/12 space-y-6 p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle>Your Flag Context</SheetTitle>
          <SheetDescription>
            You are currently viewing the site with the following context:
          </SheetDescription>
        </SheetHeader>
        {flagContext.contexts.map((context, i) => (
          <div
            key={i}
            className="flex w-full max-w-md flex-col gap-y-2 rounded-md border bg-card p-4"
          >
            <div className="flex flex-row items-center gap-x-4">
              <h1 className="font-medium">Context Kind:</h1>
              <p className="w-max rounded-md border bg-background px-4 py-1">
                {context.kind}
              </p>
            </div>
            <AttributesTable attributes={context.attributes} />
          </div>
        ))}
        <SheetFooter>
          <SheetClose asChild>
            <ClearContextButton />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function AttributesTable({
  attributes,
}: {
  attributes: Record<string, string>
}) {
  return (
    <Table>
      <AttributesTableHeader />
      <TableBody>
        {Object.entries(attributes).map(([attribute, value]) => (
          <TableRow key={attribute}>
            <AttributeTableCell attribute={attribute} />
            <TableCell className="px-0">
              <p className="text-right">{value}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
