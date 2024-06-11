import launchDarklyContextAdapter from "@/app/lib/launchdarkly/adapter"
import { getVariation } from "@/app/lib/launchdarkly/server-client"

import { getFlagContext } from "../lib/getFlagContext"

export async function FeatureFlag<TValue>({
  flag,
  defaultValue,
  render,
}: {
  flag: string
  defaultValue: TValue
  render: (value: TValue) => JSX.Element
}) {
  const context = await getFlagContext()
  const flagValue = await getVariation({
    flag,
    context: launchDarklyContextAdapter(context),
    defaultValue,
  })

  return render(flagValue)
}
