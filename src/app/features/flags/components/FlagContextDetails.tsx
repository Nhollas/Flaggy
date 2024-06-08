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
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui"

import { FlagContext } from "../types"

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
          className="fixed inset-x-0 bottom-0 m-2 h-12 max-w-screen-sm sm:mx-auto sm:mb-6"
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
      <TableHeader>
        <TableRow>
          <TableHead className="px-0 py-2">Attribute</TableHead>
          <TableHead className="px-0 py-2 text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(attributes).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="max-w-[150px] truncate px-0 text-[1.05rem] font-medium">
              {key}
            </TableCell>
            <TableCell className="px-0">
              <p className="text-right">{value}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
