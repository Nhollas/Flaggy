import { LDContext } from "@launchdarkly/node-server-sdk"

import { Context, FlagContext } from "./types"

export const launchDarklyContextAdapter = (
  flagContext: FlagContext,
): LDContext => {
  let context: LDContext
  if (flagContext.contexts.length === 0) {
    context = {
      kind: "user",
      anonymous: true,
      key: "anonymous",
    }
  } else if (flagContext.contexts.length === 1) {
    context = applySingleContext(flagContext.contexts[0]!)
  } else {
    context = applyMultiContext(flagContext.contexts)
  }
  return context
}

const applySingleContext = (context: Context): LDContext => {
  const { kind, attributes } = context
  return {
    kind,
    ...attributes,
  }
}

const applyMultiContext = (contexts: Context[]): LDContext => {
  return {
    kind: "multi",
    ...contexts.reduce((acc, context) => {
      const { kind, attributes } = context
      return {
        ...acc,
        [kind]: {
          ...attributes,
        },
      }
    }, {}),
  }
}
