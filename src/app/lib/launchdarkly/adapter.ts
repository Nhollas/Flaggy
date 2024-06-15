import { LDContext } from "@launchdarkly/node-server-sdk"

import { Context, FlagContext } from "@/app/features/flags"

type ContextChecker = (contexts: Context[]) => boolean
type ContextFunction = (contexts: Context[]) => LDContext

const launchDarklyContextAdapter = (flagContext: FlagContext): LDContext => {
  const { contexts } = flagContext

  const patterns = new Map<ContextChecker, ContextFunction>([
    [(ctxs) => ctxs.length === 0, () => unknownContext()],
    [(ctxs) => ctxs.length === 1, (ctxs) => applySingleContext(ctxs[0]!)],
    [(ctxs) => ctxs.length > 1, (ctxs) => applyMultiContext(ctxs)],
  ])

  for (const [match, adapter] of patterns) {
    if (match(contexts)) {
      return adapter(contexts)
    }
  }

  return unknownContext()
}

const unknownContext = (): LDContext => ({
  kind: "user",
  anonymous: true,
  key: "anonymous",
})

const applySingleContext = (context: Context): LDContext => ({
  kind: context.kind,
  ...context.attributes,
})

const applyMultiContext = (contexts: Context[]): LDContext => ({
  kind: "multi",
  ...Object.fromEntries(
    contexts.map(({ kind, attributes }) => [kind, attributes]),
  ),
})

export default launchDarklyContextAdapter
