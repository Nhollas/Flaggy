import { LaunchDarklyFlagProvider } from "@/app/lib/launchdarkly"

import { getFlagContext } from ".."

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
  const flagValue = await LaunchDarklyFlagProvider.getValue(
    flag,
    context,
    defaultValue,
  )

  return render(flagValue)
}
