import { getVariation } from "@/app/lib/launchdarklyServer"

import { getFlagContext, launchDarklyContextAdapter } from "../utils"

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
