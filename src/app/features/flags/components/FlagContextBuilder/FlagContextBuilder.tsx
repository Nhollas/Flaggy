"use client"

import dynamic from "next/dynamic"
import { useFieldArray } from "react-hook-form"

import { Button } from "@/app/components/ui/button"
import { Form } from "@/app/components/ui/form"
import { Skeleton } from "@/app/components/ui/skeleton"

import { PreloadedStateInput } from "./PreloadedStateInput"
import { RedirectUrlInput } from "./RedirectUrlInput"
import {
  ContextBuilderForm,
  useContextBuilderForm,
} from "./useContextBuilderForm"

const DynamicContextContainer = dynamic(() => import("./ContextContainer"), {
  loading: () => <Skeleton className="w-[100px] h-[20px] rounded-full" />,
})

export function FlagContextBuilder() {
  const form = useContextBuilderForm()
  const { append, fields: contexts } = useFieldArray({
    control: form.control,
    name: "contexts",
  })

  const addBlankContext = () => {
    append(
      {
        kind: "user",
        attributes: {
          key: "user-123",
        },
      },
      { shouldFocus: false },
    )
  }

  const createAndCopyContextUrl = ({
    contexts,
    redirectUrl,
  }: ContextBuilderForm) => {
    const data = JSON.stringify({ contexts })

    const baseUrl = window.location.origin
    let url = `${baseUrl}/api/flag/context`
    url += "?data=" + data
    url += `&redirectUrl=${baseUrl}${redirectUrl}`

    navigator.clipboard.writeText(url)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createAndCopyContextUrl)}
        className="space-y-6"
      >
        <h1 className="text-xl font-medium">Flag Context Builder</h1>
        <PreloadedStateInput />
        <Button type="button" onClick={addBlankContext}>
          Add Context
        </Button>
        <Button variant="outline" className="ml-4" type="submit">
          Generate Url
        </Button>
        {contexts.map((context, i) => (
          <DynamicContextContainer
            key={context.id}
            index={i}
            contextKind={context.kind}
          />
        ))}
        <RedirectUrlInput />
      </form>
    </Form>
  )
}
