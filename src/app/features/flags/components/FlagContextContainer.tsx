import { getFlagContext } from "@/app/lib/launchdarklyServer"

import { FlagContextDetails } from "./FlagContextDetails"

export async function FlagContextContainer() {
  const flagContext = await getFlagContext()

  if (flagContext.contexts.length === 0) {
    return
  }

  return <FlagContextDetails flagContext={flagContext} />
}
