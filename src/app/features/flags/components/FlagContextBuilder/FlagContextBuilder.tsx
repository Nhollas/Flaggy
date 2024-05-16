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
  Input,
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

import { Context } from "../../types"

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
      kind: "user",
      attributes: {
        key: "user-123",
      },
    })

  const onSubmit = (payload: ContextBuilderForm) => {
    const data = JSON.stringify({ contexts: payload.contexts })

    const baseUrl = window.location.origin
    let url = `${baseUrl}/api/flag/context`
    url += "?data=" + data
    url += `&redirectUrl=${baseUrl}${payload.redirectUrl}`

    navigator.clipboard.writeText(url.toString()).then(
      () => {
        console.log("copied to clipboard")
      },
      (err) => {
        console.error("failed to copy to clipboard", err)
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1>Flag Context Builder</h1>
        <Button type="button" onClick={() => addBlankContext()}>
          Add Context
        </Button>
        <Button variant="outline" className="ml-4" type="submit">
          Generate Url
        </Button>
        {contexts.map((context, i) => (
          <div
            key={context.id}
            className="flex flex-col gap-y-2 p-4 bg-gray-50 rounded-md border w-full max-w-md"
          >
            <div className="flex flex-row gap-x-2">
              <ContextInput index={i} context={context} />
              <AttributesInput index={i} />
            </div>
            <AttributesTable index={i} />
          </div>
        ))}
        <RedirectUrlInput />
      </form>
    </Form>
  )
}

function RedirectUrlInput() {
  const { control } = useFormContext<ContextBuilderForm>()

  return (
    <FormField
      control={control}
      name="redirectUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Redirect Url</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Redirect Url" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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

function AttributeValueInput({
  index,
  attribute,
}: {
  index: number
  attribute: string
}) {
  const { control } = useFormContext<ContextBuilderForm>()

  return (
    <FormField
      control={control}
      name={`contexts.${index}.attributes.${attribute}`}
      render={({ field }) => (
        <FormItem>
          <FormControl className="ml-auto">
            <Input
              {...field}
              placeholder="Value"
              className="w-[200px] bg-white"
            />
          </FormControl>
          <FormMessage className="text-right" />
        </FormItem>
      )}
    />
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
            {Object.entries(field.value).map(([key]) => (
              <TableRow key={key}>
                <TableCell className="font-medium text-[1.05rem] max-w-[150px] truncate">
                  {key}
                </TableCell>
                <TableCell>
                  <AttributeValueInput index={index} attribute={key} />
                </TableCell>
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
      name={`contexts.${index}.kind`}
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
                        setValue(`contexts.${index}.kind`, search)
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
                          setValue(`contexts.${index}.kind`, language.value)
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
