"use client"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui"
import { cn } from "@/app/lib/utils"

export default function ContextInput({
  contextIndex,
  setContextKind,
  contextKind,
}: {
  contextIndex: number
  setContextKind: (value: string) => void
  contextKind: string
}) {
  const defaultContextKinds: Set<string> = new Set(["user", contextKind])
  const [contextKindList, setContextKindList] = useState(defaultContextKinds)

  const [search, setSearch] = useState("")
  const handleAddCustomContext = (search: string) => {
    const loweredSearch = search.toLowerCase()
    setContextKindList((prev) => new Set(prev).add(loweredSearch))
    setContextKind(loweredSearch)
    setSearch("")
  }

  return (
    <FormField<Record<string, string>>
      name={`contexts.${contextIndex}.kind`}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Context Kind</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {contextKindList.has(field.value)
                    ? field.value
                    : "Select context kind"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search context kind..."
                  className="h-9"
                  name="context-kind-search"
                />
                <CommandList>
                  <CommandEmpty className="p-1">
                    <Button
                      className="w-full"
                      onClick={() => handleAddCustomContext(search)}
                    >
                      Add &quot;{search}&quot; Context +
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {Array.from(contextKindList).map((value) => (
                      <CommandItem
                        disabled={false}
                        value={value}
                        key={value}
                        onSelect={setContextKind}
                      >
                        {value}
                        {value === field.value && (
                          <CheckIcon className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
