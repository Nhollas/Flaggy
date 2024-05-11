"use client"

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

import { FlagContext } from "../types"

export function FlagContextDetails({
  flagContext,
}: {
  flagContext: FlagContext
}) {
  console.log("flagContext", flagContext)

  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">View Current Feature Context</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Your Flag Context</SheetTitle>
            <SheetDescription>
              You are currently viewing the site with the following context:
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Clear Context</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
