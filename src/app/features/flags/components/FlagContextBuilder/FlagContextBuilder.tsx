"use client"

import { CheckIcon } from "lucide-react"
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

import { Context, FlagContext } from "../../types"

import { useContextBuilderForm } from "./useContextBuilderForm"

export function FlagContextBuilder() {
  const form = useContextBuilderForm()
  const { append, fields: contexts } = useFieldArray({
    control: form.control,
    name: "contexts",
  })

  console.log("form", form.watch())

  const addBlankContext = () =>
    append({
      contextKind: "Default",
      contextKey: "default",
      attributes: {},
    })

  const onSubmit = (payload: FlagContext) => {
    console.log("payload", payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1>Flag Context Builder</h1>
        <pre>{JSON.stringify(contexts, null, 2)}</pre>
        <AddContextButton add={addBlankContext} />
        {contexts.map((context, i) => (
          <div key={context.id} className="flex flex-col gap-y-2">
            <div className="flex flex-row gap-x-2">
              <ContextInput index={i} context={context} />
              <FormField
                control={form.control}
                name={`contexts.${i}.contextKey`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Context Key</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AttributesInput index={i} />
          </div>
        ))}
      </form>
    </Form>
  )
}

function AddContextButton({ add }: { add: () => void }) {
  return <Button onClick={() => add()}>Add Context</Button>
}

function AttributesInput({ index }: { index: number }) {
  const { setValue, control } = useFormContext<FlagContext>()

  const addAttribute = (name: string) =>
    setValue(`contexts.${index}.attributes.${name}`, "default")

  return (
    <FormField
      control={control}
      name={`contexts.${index}.attributes`}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Attributes</FormLabel>
          {Object.keys(field.value).length === 0 ? (
            <Button onClick={() => addAttribute("test")}>Add Attribute</Button>
          ) : (
            <>
              <Button onClick={() => addAttribute("test")}>
                Add Attribute
              </Button>
              <AttributesTable attributes={field.value} />
            </>
          )}
        </FormItem>
      )}
    />
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
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="text-right">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ContextInput({ index, context }: { index: number; context: Context }) {
  const { setValue, control } = useFormContext<FlagContext>()

  const defaultContextKinds = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
  ]

  const [contextKindList, setContextKindList] = useState(defaultContextKinds)

  console.log("contextKindList", contextKindList)
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
                  {field.value
                    ? contextKindList.find(
                        (language) => language.value === field.value,
                      )?.label
                    : "Select language"}
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
                  <CommandEmpty>
                    <Button
                      onClick={() => {
                        setContextKindList((prev) => [
                          ...prev,
                          { value: search, label: search.toLowerCase() },
                        ])
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
