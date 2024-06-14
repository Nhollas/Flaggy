"use client"

import { Plus, CheckIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"

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

import { useAttributes } from "../../hooks"
import { Attributes, ContextBuilderForm } from "../../types"

export default function AttributesSelection({
  contextIndex,
}: {
  contextIndex: number
}) {
  const { setValue } = useFormContext<ContextBuilderForm>()
  const attributes = useAttributes(contextIndex)

  const setAttributes = (attributes: Attributes) => {
    setValue(`contexts.${contextIndex}.attributes`, attributes)
  }

  const addAttribute = (attribute: string) => {
    setValue(`contexts.${contextIndex}.attributes.${attribute}`, "default")
  }

  const stringToTitleCase = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const defaultAttributes = useMemo(() => {
    const existingAttributesWithKeyTitleCased: [string, string][] =
      Object.entries(attributes).map(([key]) => {
        return [key, stringToTitleCase(key)]
      })

    return new Map([
      ...existingAttributesWithKeyTitleCased,
      ["country", "Country"],
      ["email", "Email"],
      ["ip", "IP Address"],
      ["key", "Key"],
      ["name", "Name"],
      ["anonymous", "Anonymous"],
      ["firstname", "First Name"],
      ["lastname", "Last Name"],
    ])
  }, [attributes])

  const [attributeMenuItems, setAttributeMenuItems] =
    useState(defaultAttributes)

  const [search, setSearch] = useState("")

  const handleAddCustomAttribute = (search: string) => {
    const loweredSearch = search.toLowerCase()
    setAttributeMenuItems((prev) =>
      new Map(prev).set(loweredSearch, stringToTitleCase(search)),
    )
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
    } else {
      addAttribute(attribute)
    }
  }

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Attributes</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button>
              Edit attributes
              <Plus className="ml-2 size-4 shrink-0 opacity-75" />
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
                      <CheckIcon className="ml-auto size-4" />
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
