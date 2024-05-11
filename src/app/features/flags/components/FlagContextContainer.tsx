import { getFlagContext } from "../lib"

import { FlagContextDetails } from "./FlagContextDetails"

export async function FlagContextContainer() {
  const flagContext = await getFlagContext()

  if (flagContext.contexts.length === 0) {
    return null
  }

  return <FlagContextDetails flagContext={flagContext} />
}
