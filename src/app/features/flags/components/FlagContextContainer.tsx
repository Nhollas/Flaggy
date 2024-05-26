import { getFlagContext } from "../utils"

import { FlagContextDetails } from "./FlagContextDetails"

export async function FlagContextContainer() {
  const flagContext = await getFlagContext()

  console.log("flagContext", flagContext)

  if (flagContext.contexts.length === 0) {
    return
  }

  return <FlagContextDetails flagContext={flagContext} />
}
