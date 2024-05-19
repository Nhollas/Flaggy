"use client"

import { Plus, CheckIcon } from "lucide-react"
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
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui"

import { Attributes } from "../../types"

export function AttributesSelection({
  attributes,
  setAttributes,
}: {
  setAttributes: (attributes: Attributes) => void
  attributes: Attributes
}) {
  console.log("Rendering AttributesSelection", { attributes })

  const addAttribute = (attribute: string) => {
    setAttributes({
      ...attributes,
      [attribute]: "default",
    })
  }

  const defaultAttributes: Map<string, string> = new Map([
    ...Object.entries(attributes),
    ["country", "Country"],
    ["email", "Email"],
    ["ip", "IP Address"],
    ["key", "Key"],
    ["name", "Name"],
    ["anonymous", "Anonymous"],
    ["firstname", "First Name"],
    ["lastname", "Last Name"],
  ])
  const [attributeMenuItems, setAttributeMenuItems] =
    useState(defaultAttributes)

  const [search, setSearch] = useState("")

  const handleAddCustomAttribute = (search: string) => {
    const loweredSearch = search.toLowerCase()
    setAttributeMenuItems((prev) => new Map(prev).set(loweredSearch, search))
    addAttribute(loweredSearch)
    setSearch("")
  }

  const handleSelectAttribute = (attribute: string) => {
    if (attribute in attributes) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [attribute]: removed, ...rest } = attributes

      setAttributes({
        ...rest,
        key: attributes.key,
      })

      return
    }
    addAttribute(attribute)
  }

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Attributes</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button>
              Edit attributes
              <Plus className="ml-2 h-4 w-4 shrink-0 opacity-75" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search attribute..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty className="p-1">
                <Button
                  className="w-full"
                  onClick={() => handleAddCustomAttribute(search)}
                >
                  Add &quot;{search}&quot; Attribute +
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {Array.from(attributeMenuItems).map(([attribute, label]) => (
                  <CommandItem
                    disabled={attribute === "key"}
                    value={label}
                    key={attribute}
                    onSelect={() => handleSelectAttribute(attribute)}
                  >
                    {label}
                    {attribute in attributes && (
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
  )
}
