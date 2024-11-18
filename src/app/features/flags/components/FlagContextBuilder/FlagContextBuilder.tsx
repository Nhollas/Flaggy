"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useFieldArray } from "react-hook-form"

import { Button, Form, Skeleton } from "@/app/components/ui"

import { useContextBuilderForm } from "../../hooks"
import { createFlagContextUrl } from "../../lib/createFlagContextUrl"
import { ContextBuilderForm } from "../../types"

import { BaseUrlInput } from "./BaseUrlInput"
import { FlagSecretInput } from "./FlagSecretInput"
import GenerateUrlButton from "./GenerateUrlButton"
import { PreloadedStateInput } from "./PreloadedStateInput"
import { RedirectPathInput } from "./RedirectPathInput"

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
  const [isCopied, setIsCopied] = useState(false)

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
    flagSecret,
    baseUrl,
  }: ContextBuilderForm) => {
    const url = createFlagContextUrl({
      baseUrl: new URL(baseUrl),
      flagContext: { contexts },
      redirectPath,
      flagSecret,
    })

    navigator.clipboard.writeText(url)

    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 sm:space-y-6"
        onSubmit={form.handleSubmit(createAndCopyContextUrl)}
      >
        <h1 className="text-xl font-medium">Flag Context Builder</h1>
        <PreloadedStateInput />
        <FlagSecretInput />
        <BaseUrlInput />
        <section className="flex flex-row justify-between">
          <Button type="button" onClick={addBlankContext}>
            Add Context
          </Button>
          <GenerateUrlButton isCopied={isCopied} />
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
