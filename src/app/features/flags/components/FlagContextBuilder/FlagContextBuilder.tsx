"use client"

import { CheckIcon, ChevronsUpDown, Plus } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui"
import { cn } from "@/app/lib/utils"

import { Context, FlagContext } from "../../types"

import {
  ContextBuilderForm,
  useContextBuilderForm,
} from "./useContextBuilderForm"

export function FlagContextBuilder() {
  const form = useContextBuilderForm()
  const { append, fields: contexts } = useFieldArray({
    control: form.control,
    name: "contexts",
  })

  const addBlankContext = () =>
    append({
      contextKind: "user",
      attributes: {
        key: "user-123",
      },
    })

  const onSubmit = (payload: FlagContext) => {
    console.log("payload", payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1>Flag Context Builder</h1>
        <pre>{JSON.stringify(contexts, null, 2)}</pre>
        <Button onClick={() => addBlankContext()}>Add Context</Button>
        {contexts.map((context, i) => (
          <div key={context.id} className="flex flex-col gap-y-2">
            <div className="flex flex-row gap-x-2">
              <ContextInput index={i} context={context} />
              {/* <FormField
                control={form.control}
                name={`contexts.${i}.contextKey`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Context Key</FormLabel>
                    <FormControl>
                      <Input placeholder="user-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <AttributesInput index={i} />
            </div>
            <AttributesTable index={i} />
          </div>
        ))}
      </form>
    </Form>
  )
}

function AttributesInput({ index }: { index: number }) {
  const { setValue, watch } = useFormContext<ContextBuilderForm>()

  const addAttribute = (attribute: string) => {
    setValue(`contexts.${index}.attributes.${attribute}`, "default")
  }

  const attributes = watch(`contexts.${index}.attributes`)

  const defaultContextKinds = [
    { label: "Country", value: "country" },
    { label: "Email", value: "email" },
    { label: "IP Address", value: "ip" },
    { label: "Key", value: "key" },
    { label: "Name", value: "name" },
    { label: "Anonymous", value: "anonymous" },
    { label: "First Name", value: "firstname" },
    { label: "Last Name", value: "lastname" },
  ]

  const [contextKindList, setContextKindList] = useState(defaultContextKinds)

  const [search, setSearch] = useState("")

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Attributes</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button>
              Add attributes
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
                  onClick={() => {
                    setContextKindList((prev) => [
                      { value: search, label: search.toLowerCase() },
                      ...prev,
                    ])
                    addAttribute(search)
                    setSearch("")
                  }}
                >
                  Add Custom &quot;{search}&quot; Attribute +
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {contextKindList.map((language) => (
                  <CommandItem
                    disabled={false}
                    value={language.label}
                    key={language.value}
                    onSelect={() => {
                      console.log("language.value", language.value)
                      addAttribute(language.value)
                      setSearch("")
                    }}
                  >
                    {language.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        language.value in attributes
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
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

function AttributesTable({ index }: { index: number }) {
  const { control } = useFormContext<ContextBuilderForm>()

  return (
    <FormField
      control={control}
      name={`contexts.${index}.attributes`}
      render={({ field }) => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Attribute</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(field.value).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell className="text-right">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    />
  )
}

function ContextInput({ index, context }: { index: number; context: Context }) {
  const { setValue, control } = useFormContext<ContextBuilderForm>()

  const defaultContextKinds = [{ label: "User", value: "user" }]

  const [contextKindList, setContextKindList] = useState(defaultContextKinds)

  const [search, setSearch] = useState("")

  return (
    <FormField
      control={control}
      name={`contexts.${index}.contextKind`}
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
                  {field.value !== ""
                    ? contextKindList.find(
                        (language) => language.value === field.value,
                      )?.label
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
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty className="p-1">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setContextKindList((prev) => [
                          { value: search, label: search.toLowerCase() },
                          ...prev,
                        ])
                        setValue(`contexts.${index}.contextKind`, search)
                        setSearch("")
                      }}
                    >
                      Add &quot;{search}&quot; Context +
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {contextKindList.map((language) => (
                      <CommandItem
                        disabled={false}
                        value={language.label}
                        key={language.value}
                        onSelect={() => {
                          console.log("Context", context)
                          setValue(
                            `contexts.${index}.contextKind`,
                            language.value,
                          )
                        }}
                      >
                        {language.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            language.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
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
