"use client"

import { useFieldArray } from "react-hook-form"

import { Button, Form } from "@/app/components/ui"

import { useContextBuilderForm } from "../../hooks"
import { createFlagContextUrl } from "../../lib/createFlagContextUrl"
import { ContextBuilderForm } from "../../types"

import ContextContainer from "./ContextContainer"
import GenerateUrlButton from "./GenerateUrlButton"
import { PreloadedStateInput } from "./PreloadedStateInput"
import { RedirectPathInput } from "./RedirectPathInput"

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
        className="space-y-4 sm:space-y-6"
        onSubmit={form.handleSubmit(createAndCopyContextUrl)}
      >
        <h1 className="text-xl font-medium">Flag Context Builder</h1>
        <PreloadedStateInput />
        <section className="flex flex-row justify-between">
          <Button type="button" onClick={addBlankContext}>
            Add Context
          </Button>
          <GenerateUrlButton />
        </section>
        {contexts.map((context, i) => (
          <ContextContainer
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
