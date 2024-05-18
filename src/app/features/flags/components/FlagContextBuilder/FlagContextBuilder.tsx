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
  Textarea,
} from "@/app/components/ui"
import { cn } from "@/app/lib/utils"

import { Context } from "../../types"

import {
  ContextBuilderForm,
  preLoadedStateSchema,
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

    navigator.clipboard.writeText(url.toString())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-xl font-medium">Flag Context Builder</h1>
        <PreloadedStateInput />
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

function PreloadedStateInput() {
  const { control, setValue } = useFormContext<ContextBuilderForm>()

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData("text")

    const url = new URL(pastedText)

    const data = JSON.parse(url.searchParams.get("data") || "{}")
    const redirectUrl = url.searchParams.get("redirectUrl") || ""

    const valid = await preLoadedStateSchema.parseAsync({
      contexts: data.contexts,
      redirectUrl,
    })

    const urlPathame = new URL(redirectUrl).pathname

    console.log("Valid data: ", valid)
    setValue("contexts", data.contexts)
    setValue("redirectUrl", urlPathame)
  }

  const allowPasting = (e: React.KeyboardEvent) => {
    const isActionCTRLandV =
      (e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "V"

    if (!isActionCTRLandV) {
      e.preventDefault()
    }
  }

  return (
    <FormField
      control={control}
      name="preloadedState"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preloaded State</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Preloaded State (only pasting allowed)."
              onPaste={handlePaste}
              onKeyDown={allowPasting}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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

type SelectOption = {
  label: string
  value: string
}

function AttributesInput({ index }: { index: number }) {
  const { setValue, watch } = useFormContext<ContextBuilderForm>()

  const addAttribute = (attribute: string) => {
    setValue(`contexts.${index}.attributes.${attribute}`, "default")
  }

  const setAttributes = (
    attributes: {
      key: string
    } & Record<string, string>,
  ) => {
    setValue(`contexts.${index}.attributes`, attributes)
  }

  const attributes = watch(`contexts.${index}.attributes`)

  const defaultAttributes: SelectOption[] = [
    { label: "Country", value: "country" },
    { label: "Email", value: "email" },
    { label: "IP Address", value: "ip" },
    { label: "Key", value: "key" },
    { label: "Name", value: "name" },
    { label: "Anonymous", value: "anonymous" },
    { label: "First Name", value: "firstname" },
    { label: "Last Name", value: "lastname" },
    ...Object.keys(attributes).map((key) => ({
      label: key,
      value: key,
    })),
  ].reduce((acc: SelectOption[], current) => {
    const x = acc.find((item) => item.value === current.value)
    if (!x) {
      return acc.concat([current])
    } else {
      return acc
    }
  }, [])

  const [attributesList, setAttributesList] = useState(defaultAttributes)

  const [search, setSearch] = useState("")

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
                  onClick={() => {
                    setAttributesList((prev) => [
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
                {attributesList.map((attribute) => (
                  <CommandItem
                    disabled={attribute.value === "key"}
                    value={attribute.label}
                    key={attribute.value}
                    onSelect={() => {
                      if (attribute.value in attributes) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [attribute.value]: removed, ...rest } =
                          attributes

                        setAttributes({
                          ...rest,
                          key: attributes["key"],
                        })

                        return
                      }

                      addAttribute(attribute.value)
                      setSearch("")
                    }}
                  >
                    {attribute.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        attribute.value in attributes
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
  const { watch } = useFormContext<ContextBuilderForm>()

  const attributes = watch(`contexts.${index}.attributes`)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Attribute</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(attributes).map(([key]) => (
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
  )
}

function ContextInput({ index, context }: { index: number; context: Context }) {
  const { setValue, control } = useFormContext<ContextBuilderForm>()

  const defaultContextKinds: SelectOption[] = [
    { label: "User", value: "user" },
    { label: context.kind, value: context.kind },
  ].reduce((acc: SelectOption[], current) => {
    const x = acc.find((item) => item.value === current.value)
    if (!x) {
      return acc.concat([current])
    } else {
      return acc
    }
  }, [])

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
                        (contextKind) => contextKind.value === field.value,
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
                  placeholder="Search context kind..."
                  className="h-9"
                  name="context-kind-search"
                />
                <CommandList>
                  <CommandEmpty className="p-1">
                    <Button
                      className="w-full"
                      onClick={() => {
                        console.log("Adding context kind: ", search)
                        setContextKindList((prev) => [
                          { value: search.toLowerCase(), label: search },
                          ...prev,
                        ])
                        setValue(`contexts.${index}.kind`, search.toLowerCase())
                        setSearch("")
                      }}
                    >
                      Add &quot;{search}&quot; Context +
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {contextKindList.map((contextKind) => (
                      <CommandItem
                        disabled={false}
                        value={contextKind.label}
                        key={contextKind.value}
                        onSelect={() => {
                          console.log(
                            "Selected context kind: ",
                            contextKind.value,
                          )
                          setValue(`contexts.${index}.kind`, contextKind.value)
                        }}
                      >
                        {contextKind.label}
                        {contextKind.value === field.value && (
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
