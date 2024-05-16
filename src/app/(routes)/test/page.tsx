"use client"

import { withLDConsumer, LDClient } from "launchdarkly-react-client-sdk"
import { useEffect } from "react"

function TestPage({
  flags,
  ldClient,
}: {
  ldClient: LDClient
  flags: Record<string, any>
}) {
  const { exampleFlag } = flags

  console.log("exampleFlag", exampleFlag)
  console.log("flags", ldClient.variation("test", "false"))

  useEffect(() => {
    ldClient.identify({
      kind: "user",
      key: "developer",
    })
  }, [ldClient])

  return (
    <section className="w-full space-y-8">
      <p>Example flag is: {exampleFlag ? "true" : "false"}</p>
    </section>
  )
}

export default withLDConsumer()(TestPage)
