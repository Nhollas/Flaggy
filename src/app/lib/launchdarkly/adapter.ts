import { LDContext } from "@launchdarkly/node-server-sdk"

import { Context, FlagContext } from "@/app/features/flags"

const launchDarklyContextAdapter = (flagContext: FlagContext): LDContext => {
  const { contexts } = flagContext

  if (contexts.length === 0) {
    return {
      kind: "user",
      anonymous: true,
      key: "anonymous",
    }
  }

  const [firstContext] = contexts
  if (contexts.length === 1 && firstContext) {
    return applySingleContext(firstContext)
  }

  return applyMultiContext(contexts)
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

export default launchDarklyContextAdapter
