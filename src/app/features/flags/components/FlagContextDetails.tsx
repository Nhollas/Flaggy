"use client"

import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui"
import { Button } from "@/app/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
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
    <div className="grid grid-cols-2 gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">View Current Feature Context</Button>
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
              className="flex flex-col gap-y-2 p-4 bg-gray-50 rounded-md border w-full max-w-md"
            >
              <div className="flex flex-row gap-x-4 items-center">
                <h1 className="font-medium">Context Kind:</h1>
                <p className="bg-white rounded-md px-4 py-1 border w-max">
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
    </div>
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
            <TableCell className="font-medium text-[1.05rem] max-w-[150px] truncate">
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
