"use client"

import { useRouter } from "next/navigation"

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
import NextApiService from "@/app/services/NextApi.service"

import { FlagContext } from "../types"

export function FlagContextDetails({
  flagContext,
}: {
  flagContext: FlagContext
}) {
  const router = useRouter()

  const clearContext = async () => {
    await NextApiService.clearContext()
    router.refresh()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed right-4 top-4">
          View Context
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="space-y-6">
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
              <p className="w-max rounded-md border px-4 py-1">
                {context.kind}
              </p>
            </div>
            <AttributesTable attributes={context.attributes} />
          </div>
        ))}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={() => clearContext()}>
              Clear Context
            </Button>
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
          <TableHead className="w-[100px]">Attribute</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(attributes).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="max-w-[150px] truncate text-[1.05rem] font-medium">
              {key}
            </TableCell>
            <TableCell>
              <p className="text-right">{value}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
