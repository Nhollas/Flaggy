"use client"

import { useFlags, useLDClient } from "launchdarkly-react-client-sdk"
import { useEffect } from "react"

import { Paragraph } from "@/app/components/ui"

export default function TestPage() {
  const { exampleFlag } = useFlags()
  const ldClient = useLDClient()

  useEffect(() => {
    if (!ldClient) return

    ldClient.identify({
      kind: "user",
      key: "developer",
    })
  }, [ldClient])

  return (
    <section className="w-full space-y-8">
      <Paragraph>Example flag is: {exampleFlag ? "true" : "false"}</Paragraph>
    </section>
  )
}
