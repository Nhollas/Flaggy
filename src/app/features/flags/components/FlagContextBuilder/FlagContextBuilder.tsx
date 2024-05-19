"use client"

import { useCallback } from "react"
import { useFieldArray } from "react-hook-form"

import { Button, Form } from "@/app/components/ui"

import { Context } from "../../types"

import ContextContainer from "./ContextContainer"
import { PreloadedStateInput } from "./PreloadedStateInput"
import { RedirectUrlInput } from "./RedirectUrlInput"
import {
  ContextBuilderForm,
  useContextBuilderForm,
} from "./useContextBuilderForm"

export function FlagContextBuilder() {
  const form = useContextBuilderForm()
  const {
    append,
    fields: contexts,
    update,
  } = useFieldArray({
    control: form.control,
    name: "contexts",
  })

  console.log("Rendering FlagContextBuilder", contexts)

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

  const updateContext = useCallback(
    (index: number, context: Context) => {
      update(index, context)
    },
    [update],
  )

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
        <Button type="button" onClick={addBlankContext}>
          Add Context
        </Button>
        <Button variant="outline" className="ml-4" type="submit">
          Generate Url
        </Button>
        {contexts.map((context, i) => (
          <ContextContainer
            key={context.id}
            index={i}
            attributes={context.attributes}
            contextKind={context.kind}
            updateContext={updateContext}
          />
        ))}
        <RedirectUrlInput />
      </form>
    </Form>
  )
}
