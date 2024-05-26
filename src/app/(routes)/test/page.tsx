"use client"

import { useFlags } from "launchdarkly-react-client-sdk"

import { Paragraph } from "@/app/components/ui"

export default function TestPage() {
  const { exampleFlag } = useFlags()

  return (
    <section className="w-full space-y-8">
      <Paragraph>Example flag is: {exampleFlag ? "true" : "false"}</Paragraph>
    </section>
  )
}
