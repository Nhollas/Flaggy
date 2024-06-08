"use client"

import dynamic from "next/dynamic"
import { useFieldArray } from "react-hook-form"

import { Button, Form, Skeleton } from "@/app/components/ui"

import { createFlagContextUrl } from "../../utils"

import GenerateUrlButton from "./GenerateUrlButton"
import { PreloadedStateInput } from "./PreloadedStateInput"
import { RedirectPathInput } from "./RedirectPathInput"
import {
  ContextBuilderForm,
  useContextBuilderForm,
} from "./useContextBuilderForm"

const DynamicContextContainer = dynamic(() => import("./ContextContainer"), {
  loading: () => (
    <Skeleton className="h-[192.5px] w-full rounded-md border bg-muted" />
  ),
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
    redirectPath,
  }: ContextBuilderForm) => {
    const url = createFlagContextUrl({
      baseUrl: new URL(window.location.href),
      flagContext: { contexts },
      redirectPath,
    })

    navigator.clipboard.writeText(url)
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(createAndCopyContextUrl)}
      >
        <h1 className="text-xl font-medium">Flag Context Builder</h1>
        <PreloadedStateInput />
        <section className="flex flex-row gap-x-6">
          <Button type="button" onClick={addBlankContext}>
            Add Context
          </Button>
          <GenerateUrlButton />
        </section>
        {contexts.map((context, i) => (
          <DynamicContextContainer
            key={context.id}
            index={i}
            contextKind={context.kind}
          />
        ))}
        <RedirectPathInput />
      </form>
    </Form>
  )
}
